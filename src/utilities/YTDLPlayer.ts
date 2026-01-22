import { ChildProcessWithoutNullStreams, spawn } from 'child_process';
import { EventEmitter } from 'events';
import { Writable } from 'stream';
import type { CloseInfo, Song } from '../types';

export class YTDLPlayer extends EventEmitter {
  private stopped = false;
  private currentProcess: ChildProcessWithoutNullStreams | null = null;

  public play(url: string, outputStream: Writable): ChildProcessWithoutNullStreams {
    if (this.currentProcess) {
      this.stop();
    }

    this.stopped = false;

    const process = spawn('yt-dlp', ['-f', 'bestaudio', '-o', '-', url]);
    this.currentProcess = process;

    this.manualForward(process, outputStream);

    return process;
  }

  public stop(process?: ChildProcessWithoutNullStreams): void {
    const proc = process ?? this.currentProcess;
    if (!proc) {
      return;
    }

    this.stopped = true;
    proc.stdout.destroy();
    proc.stderr.destroy();
    proc.kill('SIGTERM');

    proc.emit('end');

    if (proc === this.currentProcess) {
      this.currentProcess = null;
    }
  }

  public async getMetadata(url: string): Promise<Song> {
    return new Promise((resolve, reject) => {
      let output = '';
      const metaProcess = spawn('yt-dlp', ['-J', url]);

      metaProcess.stdout.on('data', (data) => {
        output += `${data}`;
      });

      metaProcess.stderr.on('data', () => {});

      metaProcess.on('close', (code) => {
        if (code !== 0) {
          reject(new Error(`yt-dlp exited with code ${code}`));
          return;
        }
        try {
          const json = JSON.parse(output);
          const metadata: Song = {
            name: json.title ?? 'unknown',
            url,
            length: json.duration
              ? `${Math.floor(json.duration / 60)}:${json.duration % 60}`
              : 'unknown',
          };
          resolve(metadata);
        } catch (err) {
          reject(err instanceof Error ? err : new Error(String(err)));
        }
      });

      metaProcess.on('error', (err) => {
        reject(err instanceof Error ? err : new Error(String(err)));
      });
    });
  }

  private manualForward(process: ChildProcessWithoutNullStreams, outputStream: Writable): void {
    process.stdout.on('data', (chunk) => {
      try {
        outputStream.write(chunk);
      } catch {}
    });

    process.stdout.on('end', () => outputStream.end());
    process.stdout.on('error', () => {});

    process.stderr.on('data', (data) => this.emit('info', data.toString()));

    process.on('close', (code, signal) => {
      this.emit('close', { code, signal } as CloseInfo);
      this.emit('end');
      if (this.currentProcess === process) {
        this.currentProcess = null;
      }
    });

    process.on('error', () => {
      this.stop(process);
      this.emit('end');
    });
  }
}
