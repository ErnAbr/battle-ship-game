import { Howl } from "howler";

export const playHitSound = () => {
  const hitSound = new Howl({
    src: ["https://soundbible.com/mp3/Shotgun_Blast-Jim_Rogers-1914772763.mp3"],
    format: ["mp3"],
    volume: 0.8,
    onload: () => {
      hitSound.play();
    },
    onloaderror: (_, error) => {
      console.log("Error loading hit sound", error);
    },
  });
};

export const playMissSound = () => {
  const missSound = new Howl({
    src: [
      "https://soundbible.com/mp3/Single%20Water%20Droplet-SoundBible.com-425249738.mp3",
    ],
    format: ["mp3"],
    volume: 1,
    onload: () => {
      missSound.play();
    },
    onloaderror: (_, error) => {
      console.log("Error loading miss sound", error);
    },
  });
};
