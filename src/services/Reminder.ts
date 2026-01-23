import { Client } from "discord.js";
import { remindersDB } from "../database/database";
export let Reminder = (client: Client) => {
  console.log("[LOG] Reminder loop started.");
  setInterval(async () => {
    let now = Date.now();
    let dueReminders = remindersDB.filter((rem: any) => rem.remindAt <= now);
    if (dueReminders.size === 0) return;

    for (let [key, reminder] of dueReminders) {
      try {
        let user = await client.users.fetch(reminder.userId);
        console.log(`[LOG] Sending message to ${reminder.userId} ...`);
        if (user) {
          await user.send({
            content: `**Ding Dong! Reminder!**\n\n"${reminder.message}"\n\n_(Set: <t:${Math.floor(reminder.createdAt / 1000)}:R>)_`,
          });
          console.log(`[LOG] Delivered reminder to ${user.tag}`);
        }
      } catch (err) {
        console.error(
          `[ERROR] Failed to send reminder to ${reminder.userId} User might have blocked DMs.`,
        );
        console.error(err);
      } finally {
        remindersDB.delete(key);
      }
    }
  }, 30 * 1000);
};
