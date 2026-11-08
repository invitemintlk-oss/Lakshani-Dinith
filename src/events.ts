export const COUPLE = {
  bride: { first: "Lakshani", full: "H. M. Lakshani Rasangika Herath", parents: ["Mr. H. M. Upali Herath", "Mrs. H. M. Kumari Herath"] },
  groom: { first: "Dinith", full: "H. A. Dinith Akalanka Hapuarachchi", parents: ["Mr. H. A. Dayananda Hapuarachchi", "Mrs. H. A. Nirmala Hettiarachchi"] },
  monogram: "L & D",
};

export type EventType = "wedding" | "homecoming";

export type EventConfig = {
  label: string;
  sectionTitle: string;
  inviteLine: string;
  /** Countdown target, parsed with `new Date(...)` */
  countdownTarget: string;
  dateDisplay: string;
  dayDisplay: string;
  timeDisplay: string;
  /** Small line under the time (defaults to "Onwards") */
  timeSub?: string;
  messageDate: string;
  messageTime: string;
  venueName: string;
  venueImage: string;
  mapsUrl: string;
  /** Optional highlighted ceremony (e.g. Poruwa) */
  ceremony?: { label: string; title: string; time: string };
  rsvpNote: string;
  /** Hero section background image + extra classes */
  heroBg: string;
  heroBgClass?: string;
  /** Opening intro video */
  introVideo: string;
  /** Show the intro video full screen on mobile too (instead of a strip) */
  introVideoFull?: boolean;
  /** Optional full-screen intro background (replaces the corner flowers) */
  introBg?: string;
  introBgClass?: string;
  /** Optional background image for the dark RSVP section */
  rsvpBg?: string;
  /** Optional pre-shoot photo gallery */
  gallery?: string[];
  petalColors: string[];
};

export const EVENTS: Record<EventType, EventConfig> = {
  // Day 1
  wedding: {
    label: "Wedding",
    sectionTitle: "Wedding Celebration",
    inviteLine: "celebrate the union of",
    countdownTarget: "Jan 16, 2027 10:46:00",
    dateDisplay: "2027.01.16",
    dayDisplay: "SATURDAY",
    timeDisplay: "11:45 AM",
    messageDate: "January 16, 2027 (Saturday)",
    messageTime: "Poruwa Ceremony 10:46 AM · Wedding Ceremony 11:45 AM Onwards",
    venueName: "Ahaspokuna Holiday Resort",
    venueImage: "/Screenshot 2026-09-22 035106.png",
    mapsUrl: "https://maps.app.goo.gl/enLFTefG8dknz4g16?g_st=iw",
    ceremony: { label: "Auspicious Ceremony", title: "PORUWA CEREMONY", time: "10:46 AM" },
    rsvpNote: "Kindly RSVP before January 5th.",
    heroBg: "/Elegant Pink Lotus Invitation Border.png",
    heroBgClass: "bg-cover md:bg-contain bg-no-repeat bg-[#fbf6f1]",
    introVideo: "/Use_the_uploaded_202604161807.mp4",
    introBg: "/Elegant Ivory Lotus Invitation Frame.png",
    introBgClass: "bg-cover md:bg-contain bg-center bg-no-repeat bg-[#fbf5ea]",
    gallery: [
      "/pre/IMG_5773.JPG.jpeg",
      "/pre/IMG_5777.JPG.jpeg",
      "/pre/IMG_5780.JPG.jpeg",
      "/pre/IMG_5783.JPG.jpeg",
      "/pre/IMG_5779.JPG.jpeg",
      "/pre/IMG_5784.JPG.jpeg",
      "/pre/IMG_5787.JPG.jpeg",
    ],
    petalColors: ["#FBCFE8", "#F9A8D4", "#FCE7F3", "#FFFFFF"],
  },
  // Day 2
  homecoming: {
    label: "Homecoming",
    sectionTitle: "Homecoming Celebration",
    inviteLine: "celebrate the homecoming of",
    countdownTarget: "Jan 20, 2027 19:30:00",
    dateDisplay: "2027.01.20",
    dayDisplay: "WEDNESDAY",
    timeDisplay: "07:30 PM",
    timeSub: "to 11:30 PM",
    messageDate: "January 20, 2027 (Wednesday)",
    messageTime: "07:30 PM - 11:30 PM",
    venueName: "Sirimali Grand Meridian Hotel",
    venueImage: "/sirimali-grand-meridian.png",
    mapsUrl: "https://maps.app.goo.gl/98xix56cBvwSoCGz5?g_st=iw",
    rsvpNote: "Kindly RSVP before January 10th.",
    heroBg: "/Elegant Red Rose Invitation Frame.png",
    heroBgClass: "bg-cover md:bg-contain bg-no-repeat bg-white",
    introVideo: "/Bride_and_groom_walking_aisle_20261006203214 (online-video-cutter.com).mp4",
    introVideoFull: true,
    rsvpBg: "/Burgundy Floral Wedding Frame.png",
    petalColors: ["#FCA5A5", "#EF4444", "#FECACA", "#B91C1C"],
  },
};

export function getEventType(param: string | null): EventType {
  return param === "homecoming" || param === "h" ? "homecoming" : "wedding";
}
