export const DUMMY_PROFILE_DATA = {
    full_name: "Lucas Thanawat Hagfoss",
    email: "lucash.1707@gmail.com",
} as const;

// Types

export interface Track {
    id: number;
    title: string;
    duration: number;
    releaseDate: string;
    monthlyListens: number;
    totalListens: number;
    artist: string;
    album: string;
    cover: number;
}

export interface Album {
    id: number;
    title: string;
    releaseDate: string;
    cover: number;
    artist: string;
    tracks: Track[];
}

export interface Artist {
    id: number;
    name: string;
    image: number;
    albums: Album[];
}

// Data

const polyphiaCover = require("@/assets/images/albums/remember-that-you-will-die.jpg");
const nlndCover = require("@/assets/images/albums/new-levels-new-devils.jpeg");
const renaissanceCover = require("@/assets/images/albums/renaissance.jpeg");
const graduationCover = require("@/assets/images/albums/graduation.jpg");
const mbdtfCover = require("@/assets/images/albums/my-beautiful-dark-twisted-fantasy.jpeg");
const tlopCover = require("@/assets/images/albums/the-life-of-pablo.jpeg");
const polyphiaArtist = require("@/assets/images/artists/polyphia.jpeg");
const kanyeArtist = require("@/assets/images/artists/kanye.jpeg");
const zutomayoArtist = require("@/assets/images/artists/zutomayo.jpeg");

const hisohisoCover = require("@/assets/images/albums/hisohiso-banashi.jpeg");
const gusareCover = require("@/assets/images/albums/gusare.jpeg");

export const DUMMY_ARTISTS: Artist[] = [
    {
        id: 3,
        name: "ZUTOMAYO",
        image: zutomayoArtist,
        albums: [
            {
                id: 7,
                title: "Hisohiso Banashi",
                releaseDate: "2019-10-30",
                cover: hisohisoCover,
                artist: "ZUTOMAYO",
                tracks: [
                    {
                        id: 70,
                        title: "Byoushin wo Kamu",
                        duration: 225,
                        releaseDate: "2019-10-30",
                        monthlyListens: 850000,
                        totalListens: 42000000,
                        artist: "ZUTOMAYO",
                        album: "Hisohiso Banashi",
                        cover: hisohisoCover,
                    },
                    {
                        id: 71,
                        title: "Nouriue no Cracker",
                        duration: 260,
                        releaseDate: "2019-10-30",
                        monthlyListens: 620000,
                        totalListens: 28000000,
                        artist: "ZUTOMAYO",
                        album: "Hisohiso Banashi",
                        cover: hisohisoCover,
                    },
                    {
                        id: 72,
                        title: "Haze Haseru Hate no Madara",
                        duration: 245,
                        releaseDate: "2019-10-30",
                        monthlyListens: 540000,
                        totalListens: 15000000,
                        artist: "ZUTOMAYO",
                        album: "Hisohiso Banashi",
                        cover: hisohisoCover,
                    },
                    {
                        id: 73,
                        title: "Seigi",
                        duration: 270,
                        releaseDate: "2019-10-30",
                        monthlyListens: 710000,
                        totalListens: 19000000,
                        artist: "ZUTOMAYO",
                        album: "Hisohiso Banashi",
                        cover: hisohisoCover,
                    },
                    {
                        id: 74,
                        title: "Kettobashita Moufuku",
                        duration: 255,
                        releaseDate: "2019-10-30",
                        monthlyListens: 480000,
                        totalListens: 12000000,
                        artist: "ZUTOMAYO",
                        album: "Hisohiso Banashi",
                        cover: hisohisoCover,
                    },
                ],
            },
            {
                id: 8,
                title: "Gusare",
                releaseDate: "2021-02-10",
                cover: gusareCover,
                artist: "ZUTOMAYO",
                tracks: [
                    {
                        id: 80,
                        title: "Obenkyou Shite yo",
                        duration: 235,
                        releaseDate: "2021-02-10",
                        monthlyListens: 920000,
                        totalListens: 35000000,
                        artist: "ZUTOMAYO",
                        album: "Gusare",
                        cover: gusareCover,
                    },
                    {
                        id: 81,
                        title: "MILABO",
                        duration: 250,
                        releaseDate: "2021-02-10",
                        monthlyListens: 780000,
                        totalListens: 22000000,
                        artist: "ZUTOMAYO",
                        album: "Gusare",
                        cover: gusareCover,
                    },
                    {
                        id: 82,
                        title: "Tadashiku Narenai",
                        duration: 230,
                        releaseDate: "2021-02-10",
                        monthlyListens: 1200000,
                        totalListens: 48000000,
                        artist: "ZUTOMAYO",
                        album: "Gusare",
                        cover: gusareCover,
                    },
                    {
                        id: 83,
                        title: "Kan Saete Kuyashiiwa",
                        duration: 240,
                        releaseDate: "2021-02-10",
                        monthlyListens: 840000,
                        totalListens: 18000000,
                        artist: "ZUTOMAYO",
                        album: "Gusare",
                        cover: gusareCover,
                    },
                    {
                        id: 84,
                        title: "Kuraku Kuroku",
                        duration: 265,
                        releaseDate: "2021-02-10",
                        monthlyListens: 670000,
                        totalListens: 14000000,
                        artist: "ZUTOMAYO",
                        album: "Gusare",
                        cover: gusareCover,
                    },
                ],
            },
        ],
    },
    {
        id: 2,
        name: "Kanye West",
        image: kanyeArtist,
        albums: [
            {
                id: 2,
                title: "Graduation",
                releaseDate: "2007-09-07",
                cover: graduationCover,
                artist: "Kanye West",
                tracks: [
                    {
                        id: 13,
                        title: "Good Morning",
                        duration: 196,
                        releaseDate: "2007-09-07",
                        monthlyListens: 1450000,
                        totalListens: 290000000,
                        artist: "Kanye West",
                        album: "Graduation",
                        cover: graduationCover,
                    },
                    {
                        id: 14,
                        title: "Champion",
                        duration: 123,
                        releaseDate: "2007-09-07",
                        monthlyListens: 1300000,
                        totalListens: 260000000,
                        artist: "Kanye West",
                        album: "Graduation",
                        cover: graduationCover,
                    },
                    {
                        id: 15,
                        title: "Stronger",
                        duration: 311,
                        releaseDate: "2007-06-01",
                        monthlyListens: 4200000,
                        totalListens: 850000000,
                        artist: "Kanye West",
                        album: "Graduation",
                        cover: graduationCover,
                    },
                    {
                        id: 16,
                        title: "I Wonder",
                        duration: 244,
                        releaseDate: "2007-09-07",
                        monthlyListens: 1000000,
                        totalListens: 200000000,
                        artist: "Kanye West",
                        album: "Graduation",
                        cover: graduationCover,
                    },
                    {
                        id: 17,
                        title: "Good Life (feat. T-Pain)",
                        duration: 207,
                        releaseDate: "2007-09-07",
                        monthlyListens: 3100000,
                        totalListens: 620000000,
                        artist: "Kanye West",
                        album: "Graduation",
                        cover: graduationCover,
                    },
                    {
                        id: 18,
                        title: "Can't Tell Me Nothing",
                        duration: 272,
                        releaseDate: "2007-05-18",
                        monthlyListens: 1900000,
                        totalListens: 380000000,
                        artist: "Kanye West",
                        album: "Graduation",
                        cover: graduationCover,
                    },
                    {
                        id: 19,
                        title: "Barry Bonds (feat. Lil Wayne)",
                        duration: 236,
                        releaseDate: "2007-09-07",
                        monthlyListens: 1100000,
                        totalListens: 220000000,
                        artist: "Kanye West",
                        album: "Graduation",
                        cover: graduationCover,
                    },
                    {
                        id: 20,
                        title: "Drunk and Hot Girls (feat. Mos Def)",
                        duration: 265,
                        releaseDate: "2007-09-07",
                        monthlyListens: 700000,
                        totalListens: 140000000,
                        artist: "Kanye West",
                        album: "Graduation",
                        cover: graduationCover,
                    },
                    {
                        id: 21,
                        title: "Flashing Lights (feat. Dwele)",
                        duration: 241,
                        releaseDate: "2007-09-07",
                        monthlyListens: 2400000,
                        totalListens: 480000000,
                        artist: "Kanye West",
                        album: "Graduation",
                        cover: graduationCover,
                    },
                    {
                        id: 22,
                        title: "Everything I Am",
                        duration: 217,
                        releaseDate: "2007-09-07",
                        monthlyListens: 900000,
                        totalListens: 180000000,
                        artist: "Kanye West",
                        album: "Graduation",
                        cover: graduationCover,
                    },
                    {
                        id: 23,
                        title: "The Glory",
                        duration: 222,
                        releaseDate: "2007-09-07",
                        monthlyListens: 750000,
                        totalListens: 150000000,
                        artist: "Kanye West",
                        album: "Graduation",
                        cover: graduationCover,
                    },
                    {
                        id: 24,
                        title: "Homecoming (feat. Chris Martin)",
                        duration: 206,
                        releaseDate: "2007-09-07",
                        monthlyListens: 2100000,
                        totalListens: 420000000,
                        artist: "Kanye West",
                        album: "Graduation",
                        cover: graduationCover,
                    },
                    {
                        id: 25,
                        title: "Big Brother",
                        duration: 285,
                        releaseDate: "2007-09-07",
                        monthlyListens: 800000,
                        totalListens: 160000000,
                        artist: "Kanye West",
                        album: "Graduation",
                        cover: graduationCover,
                    },
                ],
            },
            {
                id: 3,
                title: "My Beautiful Dark Twisted Fantasy",
                releaseDate: "2010-11-22",
                cover: mbdtfCover,
                artist: "Kanye West",
                tracks: [
                    {
                        id: 30,
                        title: "Dark Fantasy",
                        duration: 280,
                        releaseDate: "2010-11-22",
                        monthlyListens: 1800000,
                        totalListens: 350000000,
                        artist: "Kanye West",
                        album: "My Beautiful Dark Twisted Fantasy",
                        cover: mbdtfCover,
                    },
                    {
                        id: 31,
                        title: "Power",
                        duration: 292,
                        releaseDate: "2010-05-28",
                        monthlyListens: 5200000,
                        totalListens: 1100000000,
                        artist: "Kanye West",
                        album: "My Beautiful Dark Twisted Fantasy",
                        cover: mbdtfCover,
                    },
                    {
                        id: 32,
                        title: "All of the Lights",
                        duration: 299,
                        releaseDate: "2010-11-22",
                        monthlyListens: 4500000,
                        totalListens: 950000000,
                        artist: "Kanye West",
                        album: "My Beautiful Dark Twisted Fantasy",
                        cover: mbdtfCover,
                    },
                    {
                        id: 33,
                        title: "Runaway",
                        duration: 547,
                        releaseDate: "2010-10-04",
                        monthlyListens: 3800000,
                        totalListens: 820000000,
                        artist: "Kanye West",
                        album: "My Beautiful Dark Twisted Fantasy",
                        cover: mbdtfCover,
                    },
                ],
            },
            {
                id: 4,
                title: "The Life of Pablo",
                releaseDate: "2016-02-14",
                cover: tlopCover,
                artist: "Kanye West",
                tracks: [
                    {
                        id: 40,
                        title: "Ultralight Beam",
                        duration: 320,
                        releaseDate: "2016-02-14",
                        monthlyListens: 2200000,
                        totalListens: 480000000,
                        artist: "Kanye West",
                        album: "The Life of Pablo",
                        cover: tlopCover,
                    },
                    {
                        id: 41,
                        title: "Famous",
                        duration: 196,
                        releaseDate: "2016-02-14",
                        monthlyListens: 3100000,
                        totalListens: 650000000,
                        artist: "Kanye West",
                        album: "The Life of Pablo",
                        cover: tlopCover,
                    },
                    {
                        id: 42,
                        title: "Father Stretch My Hands Pt. 1",
                        duration: 135,
                        releaseDate: "2016-02-14",
                        monthlyListens: 4800000,
                        totalListens: 980000000,
                        artist: "Kanye West",
                        album: "The Life of Pablo",
                        cover: tlopCover,
                    },
                    {
                        id: 43,
                        title: "Waves",
                        duration: 181,
                        releaseDate: "2016-02-14",
                        monthlyListens: 1900000,
                        totalListens: 410000000,
                        artist: "Kanye West",
                        album: "The Life of Pablo",
                        cover: tlopCover,
                    },
                ],
            },
        ],
    },
    {
        id: 1,
        name: "Polyphia",
        image: polyphiaArtist,
        albums: [
            {
                id: 1,
                title: "Remember That You Will Die",
                releaseDate: "2022-09-30",
                cover: polyphiaCover,
                artist: "Polyphia",
                tracks: [
                    {
                        id: 2,
                        title: "Neurotica",
                        duration: 192,
                        releaseDate: "2022-09-30",
                        monthlyListens: 380000,
                        totalListens: 7600000,
                        artist: "Polyphia",
                        album: "Remember That You Will Die",
                        cover: polyphiaCover,
                    },
                    {
                        id: 3,
                        title: "Playing God",
                        duration: 224,
                        releaseDate: "2022-07-15",
                        monthlyListens: 650000,
                        totalListens: 11800000,
                        artist: "Polyphia",
                        album: "Remember That You Will Die",
                        cover: polyphiaCover,
                    },
                    {
                        id: 4,
                        title: "ABC (feat. Sophia Black)",
                        duration: 201,
                        releaseDate: "2022-05-27",
                        monthlyListens: 1100000,
                        totalListens: 22500000,
                        artist: "Polyphia",
                        album: "Remember That You Will Die",
                        cover: polyphiaCover,
                    },
                    {
                        id: 5,
                        title: "Chimera",
                        duration: 242,
                        releaseDate: "2022-09-30",
                        monthlyListens: 290000,
                        totalListens: 5400000,
                        artist: "Polyphia",
                        album: "Remember That You Will Die",
                        cover: polyphiaCover,
                    },
                    {
                        id: 6,
                        title: "Loud (feat. Killstation)",
                        duration: 208,
                        releaseDate: "2022-09-30",
                        monthlyListens: 410000,
                        totalListens: 8100000,
                        artist: "Polyphia",
                        album: "Remember That You Will Die",
                        cover: polyphiaCover,
                    },
                    {
                        id: 7,
                        title: "Memento Mori",
                        duration: 235,
                        releaseDate: "2022-09-30",
                        monthlyListens: 340000,
                        totalListens: 6200000,
                        artist: "Polyphia",
                        album: "Remember That You Will Die",
                        cover: polyphiaCover,
                    },
                    {
                        id: 8,
                        title: "Stitches (feat. Sophia Black)",
                        duration: 194,
                        releaseDate: "2022-09-30",
                        monthlyListens: 520000,
                        totalListens: 9800000,
                        artist: "Polyphia",
                        album: "Remember That You Will Die",
                        cover: polyphiaCover,
                    },
                    {
                        id: 9,
                        title: "Genesis",
                        duration: 231,
                        releaseDate: "2022-09-30",
                        monthlyListens: 270000,
                        totalListens: 4900000,
                        artist: "Polyphia",
                        album: "Remember That You Will Die",
                        cover: polyphiaCover,
                    },
                    {
                        id: 10,
                        title: "Ego Death (feat. Steve Vai)",
                        duration: 258,
                        releaseDate: "2022-08-19",
                        monthlyListens: 890000,
                        totalListens: 18700000,
                        artist: "Polyphia",
                        album: "Remember That You Will Die",
                        cover: polyphiaCover,
                    },
                    {
                        id: 11,
                        title: "Bloodbath",
                        duration: 164,
                        releaseDate: "2022-09-30",
                        monthlyListens: 180000,
                        totalListens: 3200000,
                        artist: "Polyphia",
                        album: "Remember That You Will Die",
                        cover: polyphiaCover,
                    },
                    {
                        id: 12,
                        title: "Time Alone With God",
                        duration: 312,
                        releaseDate: "2022-09-30",
                        monthlyListens: 430000,
                        totalListens: 8800000,
                        artist: "Polyphia",
                        album: "Remember That You Will Die",
                        cover: polyphiaCover,
                    },
                ],
            },
            {
                id: 5,
                title: "New Levels New Devils",
                releaseDate: "2018-10-12",
                cover: nlndCover,
                artist: "Polyphia",
                tracks: [
                    {
                        id: 1,
                        title: "G.O.A.T.",
                        duration: 178,
                        releaseDate: "2018-10-12",
                        monthlyListens: 720000,
                        totalListens: 14200000,
                        artist: "Polyphia",
                        album: "New Levels New Devils",
                        cover: nlndCover,
                    },
                    {
                        id: 50,
                        title: "O.D.",
                        duration: 202,
                        releaseDate: "2018-10-12",
                        monthlyListens: 310000,
                        totalListens: 6200000,
                        artist: "Polyphia",
                        album: "New Levels New Devils",
                        cover: nlndCover,
                    },
                    {
                        id: 51,
                        title: "Yas (feat. Mario Camarena & Erick Hansel)",
                        duration: 201,
                        releaseDate: "2018-10-12",
                        monthlyListens: 450000,
                        totalListens: 8900000,
                        artist: "Polyphia",
                        album: "New Levels New Devils",
                        cover: nlndCover,
                    },
                    {
                        id: 52,
                        title: "Saucy",
                        duration: 181,
                        releaseDate: "2018-10-12",
                        monthlyListens: 280000,
                        totalListens: 5400000,
                        artist: "Polyphia",
                        album: "New Levels New Devils",
                        cover: nlndCover,
                    },
                ],
            },
            {
                id: 6,
                title: "Renaissance",
                releaseDate: "2016-03-11",
                cover: renaissanceCover,
                artist: "Polyphia",
                tracks: [
                    {
                        id: 60,
                        title: "Culture Shock",
                        duration: 213,
                        releaseDate: "2016-03-11",
                        monthlyListens: 150000,
                        totalListens: 3100000,
                        artist: "Polyphia",
                        album: "Renaissance",
                        cover: renaissanceCover,
                    },
                    {
                        id: 61,
                        title: "Light",
                        duration: 231,
                        releaseDate: "2016-03-11",
                        monthlyListens: 120000,
                        totalListens: 2400000,
                        artist: "Polyphia",
                        album: "Renaissance",
                        cover: renaissanceCover,
                    },
                    {
                        id: 62,
                        title: "Florence",
                        duration: 246,
                        releaseDate: "2016-03-11",
                        monthlyListens: 180000,
                        totalListens: 3500000,
                        artist: "Polyphia",
                        album: "Renaissance",
                        cover: renaissanceCover,
                    },
                    {
                        id: 63,
                        title: "Euphoria",
                        duration: 234,
                        releaseDate: "2016-03-11",
                        monthlyListens: 210000,
                        totalListens: 4200000,
                        artist: "Polyphia",
                        album: "Renaissance",
                        cover: renaissanceCover,
                    },
                ],
            },
        ],
    },
];

// ─── Derived sections ─────────────────────────────────────────────────────────

const ALL_TRACKS: Track[] = DUMMY_ARTISTS.flatMap((a) =>
    a.albums.flatMap((al) => al.tracks),
);

export const NEW_RELEASES: Track[] = [...ALL_TRACKS]
    .sort(
        (a, b) =>
            new Date(b.releaseDate).getTime() -
            new Date(a.releaseDate).getTime(),
    )
    .slice(0, 3);

export const TRENDING_NOW: Track[] = [...ALL_TRACKS]
    .sort((a, b) => b.monthlyListens - a.monthlyListens)
    .slice(0, 5);

export const TOP_CHARTS: Track[] = [...ALL_TRACKS]
    .sort((a, b) => b.totalListens - a.totalListens)
    .slice(0, 5);

export const LIBRARY_SECTIONS = [
    { category: { name: "New Releases" }, tracks: NEW_RELEASES },
    { category: { name: "Trending Now" }, tracks: TRENDING_NOW },
    { category: { name: "Top Charts" }, tracks: TOP_CHARTS },
];
