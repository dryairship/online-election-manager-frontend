const CONFIG = {
    DISPLAY_PHOTOS: false,
    MAX_PREFERENCES: 3,
    ELECTION_TITLE: "Elections | IIT Kanpur"
};

if(process.env.REACT_APP_DISPLAY_PHOTOS) {
    CONFIG.DISPLAY_PHOTOS = process.env.REACT_APP_DISPLAY_PHOTOS === "true";
}

if(process.env.REACT_APP_MAX_PREFERENCES) {
    CONFIG.MAX_PREFERENCES = parseInt(process.env.REACT_APP_MAX_PREFERENCES);
}

if(process.env.REACT_APP_ELECTION_TITLE) {
    CONFIG.ELECTION_TITLE = process.env.REACT_APP_ELECTION_TITLE;
}

Object.freeze(CONFIG);

export default CONFIG;
