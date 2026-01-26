import Enmap from "enmap";
export const remindersDB = new Enmap({ name: "reminders" });
export const statsDB = new Enmap({ name: "stats" });

export const updateSongStats = (song: any) => {
  if (!song || !song.url) return;

  const songKey = song.url;
  statsDB.ensure(songKey, {
    title: song.name,
    url: song.url,
    count: 0,
  });
  statsDB.math(songKey, "+", 1, "count");
  console.log(`[STATS] Counter updated for: ${song.name}`);
};
