// Replace this with your direct audio link.
export const GITA_AUDIO_URL = "https://www.dropbox.com/scl/fi/lkc2sjilagd0jokrvf40o/gita_audio.mp3?rlkey=2x3jxfy0bdxkr4061yayglojm&st=5nciqwdm&raw=1";

export interface Chapter {
  id: number;
  title: string;
  description: string;
  startTime: number; // in seconds
}

export const GITA_CHAPTERS: Chapter[] = [
  { id: 1, title: "Chapter 1: Arjuna Vishada Yoga", description: "The Yoga of Arjuna's Dejection", startTime: 0 },
  { id: 2, title: "Chapter 2: Sankhya Yoga", description: "The Yoga of Knowledge", startTime: 720 }, // 12:00
  { id: 3, title: "Chapter 3: Karma Yoga", description: "The Yoga of Action", startTime: 1800 }, // 30:00
  { id: 4, title: "Chapter 4: Jnana Karma Sanyasa Yoga", description: "The Yoga of Knowledge and the Disciplines of Action", startTime: 2700 }, // 45:00
  { id: 5, title: "Chapter 5: Karma Sanyasa Yoga", description: "The Yoga of Renunciation", startTime: 3600 }, // 1:00:00
  { id: 6, title: "Chapter 6: Dhyana Yoga", description: "The Yoga of Meditation", startTime: 4500 }, // 1:15:00
  { id: 7, title: "Chapter 7: Jnana Vijnana Yoga", description: "The Yoga of Knowledge and Wisdom", startTime: 5400 }, // 1:30:00
  { id: 8, title: "Chapter 8: Akshara Brahma Yoga", description: "The Yoga of the Imperishable Brahman", startTime: 6300 }, // 1:45:00
  { id: 9, title: "Chapter 9: Raja Vidya Raja Guhya Yoga", description: "The Yoga of the Sovereign Science and the Sovereign Secret", startTime: 7200 }, // 2:00:00
  { id: 10, title: "Chapter 10: Vibhuti Yoga", description: "The Yoga of Divine Manifestations", startTime: 8100 }, // 2:15:00
  { id: 11, title: "Chapter 11: Vishwarupa Darshana Yoga", description: "The Yoga of the Vision of the Universal Form", startTime: 9000 }, // 2:30:00
  { id: 12, title: "Chapter 12: Bhakti Yoga", description: "The Yoga of Devotion", startTime: 10800 }, // 3:00:00
  { id: 13, title: "Chapter 13: Kshetra Kshetrajna Vibhaga Yoga", description: "The Yoga of the Field and the Knower of the Field", startTime: 11700 }, // 3:15:00
  { id: 14, title: "Chapter 14: Gunatraya Vibhaga Yoga", description: "The Yoga of the Division of the Three Gunas", startTime: 12600 }, // 3:30:00
  { id: 15, title: "Chapter 15: Purushottama Yoga", description: "The Yoga of the Supreme Person", startTime: 13500 }, // 3:45:00
  { id: 16, title: "Chapter 16: Daivasura Sampad Vibhaga Yoga", description: "The Yoga of the Division between the Divine and the Demoniacal", startTime: 14400 }, // 4:00:00
  { id: 17, title: "Chapter 17: Shraddhatraya Vibhaga Yoga", description: "The Yoga of the Division of the Threefold Faith", startTime: 15300 }, // 4:15:00
  { id: 18, title: "Chapter 18: Moksha Sanyasa Yoga", description: "The Yoga of Liberation and Renunciation", startTime: 16200 }, // 4:30:00
];
