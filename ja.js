
 */

// Defining useful global variables
let msgLimit, hideAfter, hideCommands, provider, hasEmotes, widget_width;
let totalMsg = 0;
let ignoredUsers = [];
let commands = [];
let removeSelector;
let displayBadges = 'no';
let displayPronouns = 'no';
let test_streamer, test_mod, test_sub, test_reg;

let events = {
    cheer: {
        enabled: false,
        min: 1,
        class: "cheer"
    },
    tip: {
        enabled: false,
        min: 1,
        currency: "$",
        class: "tip"
    },
    sub: {
        enabled: false,
        class: "sub"
    },
    resub: {
        enabled: false,
        class: "resub"
    },
    gift: {
        enabled: false,
        class: "gift"
    },
    direct: {
        enabled: false,
        class: "direct"
    }
}

// this is arguably *the* worst way i could have handled colors...
// if you want to save your sanity, just don't scroll down and
// do not look at my adjustColor() function...
//
// I just realized i had to bake in dynamic colors too late in the game
// and was way too lazy to go back and fix everything, so we ended up
// with some tasty mom's code spaghetti!
let customAccent;
let theme = "gold"
let colors = {
    gradient_color: "linear-gradient(to right, #ffe7a1, #f8c779);",
    mod_border_color: "#f8c779",
    mod_line_color: "#f8c77970",
    sub_border_color: "#71638e",
    sub_line_color: "#71638e70",
    alert_border_color: "#f8c779"
}

// Initial setup on widget startup
window.addEventListener('onWidgetLoad', async function (obj) {
    // Grabbing chat settings from fields
    const fieldData = obj.detail.fieldData;
    hideAfter = fieldData.hideAfter;
    msgLimit = fieldData.messagesLimit;
    hideCommands = fieldData.hideCommands;
    displayBadges = fieldData.displayBadges;
    displayPronouns = fieldData.displayPronouns;

    events.cheer.enabled = fieldData.cheerEnabled;
    events.cheer.min = fieldData.cheerMin;

    events.tip.enabled = fieldData.tipEnabled;
    events.tip.min = fieldData.tipMin;
    events.tip.currency = fieldData.tipCurrency;

    events.sub.enabled = fieldData.subEnabled;

    events.resub.enabled = fieldData.resubEnabled;

    events.gift.enabled = fieldData.giftEnabled;

    events.direct.enabled = fieldData.directEnabled;
    console.log($(".main-container"))
	
  	if (fieldData.align === 'top') {
      	$('.main-container').addClass('align-top')
    } else {
      	$('.main-container').addClass('align-bottom')
    }
  
    customAccent = fieldData.customAccent;
    theme = fieldData.theme;
    adjustColor();

    widget_width = $(document).width();
    channelName = fieldData.testMessageName

    // when will SE editor give me an option to collapse objects.......
    test_streamer = new CustomEvent("onEventReceived", {
        detail: {
            listener: "message",
            event: {
                service: "twitch",
                data: {
                    time: Date.now(),
                    tags: {
                        "badge-info": "",
                        badges: "broadcaster/1",
                        color: "#5B99FF",
                        "display-name": "StreamElements",
                        emotes: "25:46-50",
                        flags: "",
                        id: "43285909-412c-4eee-b80d-89f72ba53142",
                        mod: "1",
                        "room-id": "85827806",
                        subscriber: "0",
                        "tmi-sent-ts": "1579444549265",
                        turbo: "0",
                        "user-id": "100135110",
                        "user-type": "mod"
                    },
                    nick: channelName,
                    userId: "100135110",
                    displayName: "Broadcaster",
                    displayColor: "#5B99FF",
                    badges: [{
                        type: "moderator",
                        version: "1",
                        url: "https://static-cdn.jtvnw.net/badges/v1/3267646d-33f0-4b17-b3df-f923a41db1d0/3",
                        description: "Moderator"
                    }, {
                        type: "partner",
                        version: "1",
                        url: "https://static-cdn.jtvnw.net/badges/v1/d12a2e27-16f6-41d0-ab77-b780518f00a3/3",
                        description: "Verified"
                    }],
                    channel: channelName,
                    text: "Testing broadcaster message...",
                    isAction: !1,
                    emotes: [{
                        type: "twitch",
                        name: "Kappa",
                        id: "25",
                        gif: !1,
                        urls: {
                            1: "https://static-cdn.jtvnw.net/emoticons/v1/25/1.0",
                            2: "https://static-cdn.jtvnw.net/emoticons/v1/25/1.0",
                            4: "https://static-cdn.jtvnw.net/emoticons/v1/25/3.0"
                        },
                        start: 46,
                        end: 50
                    }],
                    msgId: ""
                },
                renderedText: 'Lorem Ipsum <img src="https://static-cdn.jtvnw.net/emoticons/v1/25/1.0" srcset="https://static-cdn.jtvnw.net/emoticons/v1/25/1.0 1x, https://static-cdn.jtvnw.net/emoticons/v1/25/1.0 2x, https://static-cdn.jtvnw.net/emoticons/v1/25/3.0 4x" title="Kappa" class="emote"> Broadcaster Test'
            }
        }
    });

    test_mod = new CustomEvent("onEventReceived", {
        detail: {
            listener: "message",
            event: {
                service: "twitch",
                data: {
                    time: Date.now(),
                    tags: {
                        "badge-info": "",
                        badges: "moderator/1",
                        color: "#5B99FF",
                        "display-name": "StreamElements",
                        emotes: "25:46-50",
                        flags: "",
                        id: "43285909-412c-4eee-b80d-89f72ba53142",
                        mod: "1",
                        "room-id": "85827806",
                        subscriber: "0",
                        "tmi-sent-ts": "1579444549265",
                        turbo: "0",
                        "user-id": "100135110",
                        "user-type": "mod"
                    },
                    nick: channelName,
                    userId: "100135110",
                    displayName: "Moderator",
                    displayColor: "#5B99FF",
                    badges: [{
                        type: "moderator",
                        version: "1",
                        url: "https://static-cdn.jtvnw.net/badges/v1/3267646d-33f0-4b17-b3df-f923a41db1d0/3",
                        description: "Moderator"
                    }, {
                        type: "partner",
                        version: "1",
                        url: "https://static-cdn.jtvnw.net/badges/v1/d12a2e27-16f6-41d0-ab77-b780518f00a3/3",
                        description: "Verified"
                    }],
                    channel: channelName,
                    text: "This is your moderator message...",
                    isAction: !1,
                    emotes: [],
                    msgId: ""
                },
                renderedText: 'Test message. <img src="https://static-cdn.jtvnw.net/emoticons/v1/25/1.0" srcset="https://static-cdn.jtvnw.net/emoticons/v1/25/1.0 1x, https://static-cdn.jtvnw.net/emoticons/v1/25/1.0 2x, https://static-cdn.jtvnw.net/emoticons/v1/25/3.0 4x" title="Kappa" class="emote">'
            }
        }
    });

    test_sub = new CustomEvent("onEventReceived", {
        detail: {
            listener: "message",
            event: {
                service: "twitch",
                data: {
                    time: Date.now(),
                    tags: {
                        "badge-info": "",
                        badges: "subscriber/1",
                        color: "#5B99FF",
                        "display-name": "StreamElements",
                        emotes: "25:46-50",
                        flags: "",
                        id: "43285909-412c-4eee-b80d-89f72ba53142",
                        mod: "1",
                        "room-id": "85827806",
                        subscriber: "0",
                        "tmi-sent-ts": "1579444549265",
                        turbo: "0",
                        "user-id": "100135110",
                        "user-type": "mod"
                    },
                    nick: channelName,
                    userId: "100135110",
                    displayName: "Subscriber",
                    displayColor: "#5B99FF",
                    badges: [{
                        type: "partner",
                        version: "1",
                        url: "https://static-cdn.jtvnw.net/badges/v1/d12a2e27-16f6-41d0-ab77-b780518f00a3/3",
                        description: "Verified"
                    }],
                    channel: channelName,
                    text: "I am a subscriber!",
                    isAction: !1,
                    emotes: [],
                    msgId: ""
                },
                renderedText: 'Test message. <img src="https://static-cdn.jtvnw.net/emoticons/v1/25/1.0" srcset="https://static-cdn.jtvnw.net/emoticons/v1/25/1.0 1x, https://static-cdn.jtvnw.net/emoticons/v1/25/1.0 2x, https://static-cdn.jtvnw.net/emoticons/v1/25/3.0 4x" title="Kappa" class="emote">'
            }
        }
    });

    test_reg = new CustomEvent("onEventReceived", {
        detail: {
            listener: "message",
            event: {
                service: "twitch",
                data: {
                    time: Date.now(),
                    tags: {
                        "badge-info": "",
                        badges: "",
                        color: "#5B99FF",
                        "display-name": "StreamElements",
                        emotes: "25:46-50",
                        flags: "",
                        id: "43285909-412c-4eee-b80d-89f72ba53142",
                        mod: "1",
                        "room-id": "85827806",
                        subscriber: "0",
                        "tmi-sent-ts": "1579444549265",
                        turbo: "0",
                        "user-id": "100135110",
                        "user-type": "mod"
                    },
                    nick: channelName,
                    userId: "100135110",
                    displayName: channelName,
                    displayColor: "#5B99FF",
                    badges: [],
                    channel: channelName,
                    text: "Test message Kappa",
                    isAction: !1,
                    emotes: [],
                    msgId: ""
                },
                renderedText: 'Test message. <img src="https://static-cdn.jtvnw.net/emoticons/v1/25/1.0" srcset="https://static-cdn.jtvnw.net/emoticons/v1/25/1.0 1x, https://static-cdn.jtvnw.net/emoticons/v1/25/1.0 2x, https://static-cdn.jtvnw.net/emoticons/v1/25/3.0 4x" title="Kappa" class="emote">'
            }
        }
    });
    test_reg.detail.event.data.text = fieldData.testMessageText;

    // Grabbing the service used for chatbox (Twitch, YouTube, Mixer)
    fetch('https://api.streamelements.com/kappa/v2/channels/' + obj.detail.channel.id + '/')
        .then(response => response.json()).then((profile) => {
            provider = profile.provider;
        });

    removeSelector = ".message-row:nth-last-child(n+" + (msgLimit + 1) + ")"

    // Setting up the list of users whose messages will be ignored
    ignoredUsers = fieldData.ignoredUsers.toLowerCase()
        .replace(" ", "").split(",");
    commands = fieldData.ignoredCommands.toLowerCase()
        .replace(" ", "").split(",");
});

// Listen for StreamElements events
window.addEventListener('onEventReceived', function (obj) {
    // Define what to do on different events

    if (obj.detail.event.listener === 'widget-button') {
        switch (obj.detail.event.field) {
            case 'testMessage':
                test_streamer.detail.event.data.msgId = (Math.random() + 1).toString(36).substring(7) + (Math.random() + 1).toString(36).substring(7)
                window.dispatchEvent(test_streamer);
                break;
            case 'testMessage1':
                test_mod.detail.event.data.msgId = (Math.random() + 1).toString(36).substring(7) + (Math.random() + 1).toString(36).substring(7)
                window.dispatchEvent(test_mod);
                break
            case 'testMessage2':
                test_sub.detail.event.data.msgId = (Math.random() + 1).toString(36).substring(7) + (Math.random() + 1).toString(36).substring(7)
                window.dispatchEvent(test_sub);
                break
            case 'testMessage3':
                test_reg.detail.event.data.msgId = (Math.random() + 1).toString(36).substring(7) + (Math.random() + 1).toString(36).substring(7)
                window.dispatchEvent(test_reg);
                break
        }
    }

    // Check for events that correspond to message deletion
    if (obj.detail.listener === "delete-message") {
        const msgId = obj.detail.event.msgId;
        $(`.message-row[data-msgid=${msgId}]`).remove();
        return;
    } else if (obj.detail.listener === "delete-messages") {
        const sender = obj.detail.event.userId;
        $(`.message-row[data-sender=${sender}]`).remove();
        return;
    }

    if (obj.detail.listener === "cheer-latest") {
        let username = obj.detail.event.name;
        let amount = obj.detail.event.amount;
        if (amount < events.cheer.min || !events.cheer.enabled) {
            return
        }
        alertCheer(username, amount);
        adjustColor()
        return
    }

    if (obj.detail.listener === "tip-latest") {
        let username = obj.detail.event.name;
        let amount = obj.detail.event.amount;
        if (amount < events.tip.min || !events.tip.enabled) {
            return
        }
        alertTip(username, amount);
        adjustColor()
        return
    }

    if (obj.detail.listener === "subscriber-latest") {
        let event = obj.detail.event;

        let username = event.name;
        let amount = event.amount;

        // deal with gifts from here onwards
        let gift = event.gifted;
        let sender = event.sender;

        // idk what community gifts do, so i'm not gonna bother
        if (event.isCommunityGift) {
            return
        };

        // i'm honestly extremely confused why they have 3 different gift fields Smoge
        let bulk = event.bulkGifted;

        if (bulk && events.gift.enabled) {
            alertBulkGift(username, amount);
        } else if (gift && events.direct.enabled) {
            alertGift(sender, username);
        } else if (amount > 1 && events.resub.enabled) {
            alertReSub(username, amount);
        } else if (events.sub.enabled) {
            alertSub(username);
        }
        adjustColor()
        return;
    }

    // Check if the event is a chat message
    if (obj.detail.listener === "message") {
        let data = obj.detail.event.data;
        console.log(data)
        if (ignoredUsers.indexOf(data.nick) !== -1) {
            return;
        }

        let badge;
        let badges = ``;
        if (displayBadges) {
            for (let i = 0; i < data.badges.length; i++) {
                badge = data.badges[i];
                badges += `<img alt="" src="${badge.url}" class="badge"> `;
            }
        }

        let role = check_role(data);
        let name = data.displayName;
        let message = attachEmotes(data);

        let emoteOnly = isEmote(data)

        const isCommand = commands.some(prefix => data.text.startsWith(prefix));
        if (isCommand && hideCommands === "yes") {
            return;
        }

        let p = null;

        const __p = fetch('https://pronouns.alejo.io/api/users/' + data.displayName)
            .then((response) => response.json())
            .then((user) => {
                if (!user.length) {
                    return null;
                } else return user[0].pronoun_id;
            });

        beautifyPronouns(p, __p).then(pn => addMessage(name, role, badges, message, emoteOnly, data.isAction, data.userId, data.msgId, pn));
    }
});

// A function that renders the message in DOM
function addMessage(name, badge, badges, message, isEmote, isAction, userId, msgId, pn) {
    // Advance the counter of total messages by 1 to keep track
    // of how many there are at any point
    totalMsg += 1;
    // Define a CSS class for a certain action
    let actionClass, emoteOnly;
    if (isAction) {
        actionClass = "action"; // i did not bother supporting this
    } else {
        actionClass = "";
    }

    if (isEmote) {
        emoteOnly = "emote-only"
    } else {
        emoteOnly = ""
    }

    let line_style;
    switch (badge) {
        case "broadcaster":
            role_style = 'style="border: solid 2px ' + colors.mod_border_color + '"'
            icon_style = role_style
            line_style = 'style="background-color:' + colors.mod_line_color + '"'
            break;
        case "moderator":
            role_style = 'style="border: solid 2px ' + colors.mod_border_color + '"'
            icon_style = role_style
            line_style = 'style="background-color:' + colors.mod_line_color + '"'
            break;
        case "subscriber":
            role_style = 'style="border: solid 2px ' + colors.sub_border_color + '"'
            icon_style = 'style="border: none"'
            line_style = 'style="background-color:' + colors.sub_line_color + '"'
            break;
        default:
            role_style = ''
            icon_style = ''
            line_style = 'style="background-color: #463d5a70;"'
            break;
    }



    let pn_none = ""
    if (!displayPronouns || pn == null) {
        pn_none = "style='display: none'"
    }

    let icon, icon_class, is_mod;
    switch (badge) {
        case "broadcaster":
            icon = `<svg class="moon animate-moon-in" width="76px" height="76px">
                  <defs>
                  <linearGradient id="PSgrad_0" x1="0%" x2="0%" y1="0%" y2="100%">
                    <stop offset="0%" stop-color="rgb(248,199,121)" stop-opacity="1" />
                    <stop offset="100%" stop-color="rgb(255,231,161)" stop-opacity="1" />
                  </linearGradient>

                  </defs>
                  <path fill-rule="evenodd"  fill="rgb(255, 255, 255)"
                   d="M38.639,41.303 C35.515,41.303 32.983,38.771 32.983,35.647 C32.983,32.950 34.871,30.696 37.397,30.129 C37.323,30.127 37.248,30.124 37.174,30.124 C33.314,30.124 30.185,33.253 30.185,37.113 C30.185,40.973 33.314,44.102 37.174,44.102 C41.33,44.102 44.162,40.973 44.162,37.113 C44.162,37.38 44.159,36.964 44.157,36.889 C43.590,39.415 41.336,41.303 38.639,41.303 Z"/>
                  <path fill="url(#PSgrad_0)"
                   d="M38.639,41.303 C35.515,41.303 32.983,38.771 32.983,35.647 C32.983,32.950 34.871,30.696 37.397,30.129 C37.323,30.127 37.248,30.124 37.174,30.124 C33.314,30.124 30.185,33.253 30.185,37.113 C30.185,40.973 33.314,44.102 37.174,44.102 C41.33,44.102 44.162,40.973 44.162,37.113 C44.162,37.38 44.159,36.964 44.157,36.889 C43.590,39.415 41.336,41.303 38.639,41.303 Z"/>
                  </svg>`
            icon_class = badge + "-box";
            is_mod = "glow"
            break;
        case "moderator":
            icon = `<svg class="moon animate-moon-in" width="76px" height="76px">
                      <defs>
                      <linearGradient id="PSgrad_0" x1="0%" x2="0%" y1="0%" y2="100%">
                        <stop offset="0%" stop-color="rgb(248,199,121)" stop-opacity="1" />
                        <stop offset="100%" stop-color="rgb(255,231,161)" stop-opacity="1" />
                      </linearGradient>
    
                      </defs>
                      <path fill-rule="evenodd"  fill="rgb(255, 255, 255)"
                       d="M38.639,41.303 C35.515,41.303 32.983,38.771 32.983,35.647 C32.983,32.950 34.871,30.696 37.397,30.129 C37.323,30.127 37.248,30.124 37.174,30.124 C33.314,30.124 30.185,33.253 30.185,37.113 C30.185,40.973 33.314,44.102 37.174,44.102 C41.33,44.102 44.162,40.973 44.162,37.113 C44.162,37.38 44.159,36.964 44.157,36.889 C43.590,39.415 41.336,41.303 38.639,41.303 Z"/>
                      <path fill="url(#PSgrad_0)"
                       d="M38.639,41.303 C35.515,41.303 32.983,38.771 32.983,35.647 C32.983,32.950 34.871,30.696 37.397,30.129 C37.323,30.127 37.248,30.124 37.174,30.124 C33.314,30.124 30.185,33.253 30.185,37.113 C30.185,40.973 33.314,44.102 37.174,44.102 C41.33,44.102 44.162,40.973 44.162,37.113 C44.162,37.38 44.159,36.964 44.157,36.889 C43.590,39.415 41.336,41.303 38.639,41.303 Z"/>
                      </svg>`
            icon_class = badge + "-box";
            is_mod = "glow"
            break;
        case "subscriber":
            icon = `<svg class="moon animate-moon-in" width="76px" height="76px">
                          <defs>
                          <linearGradient id="PSgrad_0" x1="0%" x2="0%" y1="0%" y2="100%">
                            <stop offset="0%" stop-color="rgb(248,199,121)" stop-opacity="1" />
                            <stop offset="100%" stop-color="rgb(255,231,161)" stop-opacity="1" />
                          </linearGradient>
        
                          </defs>
                          <path fill-rule="evenodd"  fill="rgb(255, 255, 255)"
                           d="M38.639,41.303 C35.515,41.303 32.983,38.771 32.983,35.647 C32.983,32.950 34.871,30.696 37.397,30.129 C37.323,30.127 37.248,30.124 37.174,30.124 C33.314,30.124 30.185,33.253 30.185,37.113 C30.185,40.973 33.314,44.102 37.174,44.102 C41.33,44.102 44.162,40.973 44.162,37.113 C44.162,37.38 44.159,36.964 44.157,36.889 C43.590,39.415 41.336,41.303 38.639,41.303 Z"/>
                          <path fill="url(#PSgrad_0)"
                           d="M38.639,41.303 C35.515,41.303 32.983,38.771 32.983,35.647 C32.983,32.950 34.871,30.696 37.397,30.129 C37.323,30.127 37.248,30.124 37.174,30.124 C33.314,30.124 30.185,33.253 30.185,37.113 C30.185,40.973 33.314,44.102 37.174,44.102 C41.33,44.102 44.162,40.973 44.162,37.113 C44.162,37.38 44.159,36.964 44.157,36.889 C43.590,39.415 41.336,41.303 38.639,41.303 Z"/>
                          </svg>`
            is_mod = "reg-glow"
            break;
        default:
            icon = `<svg class="sparkle" width="12px" height="12px">
                    <path fill-rule="evenodd" fill="rgb(159, 146, 187)"
                        d="M11.167,5.801 C7.990,5.801 6.446,4.257 6.446,1.79 C6.446,0.833 6.247,0.633 6.1,0.633 C5.754,0.633 5.555,0.833 5.555,1.79 C5.555,4.257 4.11,5.801 0.834,5.801 C0.588,5.801 0.388,6.1 0.388,6.247 C0.388,6.493 0.588,6.692 0.834,6.692 C4.11,6.692 5.555,8.237 5.555,11.414 C5.555,11.660 5.754,11.859 6.1,11.859 C6.247,11.859 6.446,11.660 6.446,11.414 C6.446,8.237 7.990,6.692 11.167,6.692 C11.414,6.692 11.613,6.493 11.613,6.247 C11.613,6.1 11.414,5.801 11.167,5.801 Z" />
                </svg>`
            is_mod = "reg-glow"
            break;
    }

    name_ = name.concat("");
    let block_to_append = `
    <div data-sender="${userId}" data-msgid="${msgId}" class="message-row" id="msg-${totalMsg}">
        <div class="left-decor">
            <div ${icon_style} class="icon-wrap ${icon_class}">
                ${icon}
            </div>
            <div class="line">
            </div>
            <div class="line-2">
            </div>
        </div>
        <div class="message-wrap">
            <div class="user-box">
                <span class="left">
					${badges}
                    <p class="username">${name}</p>
                    <span ${pn_none} class="pronouns">
                        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="12px"
                            height="12px">
                            <path fill-rule="evenodd" fill="rgb(96, 83, 123)"
                                d="M11.167,5.801 C7.990,5.801 6.446,4.257 6.446,1.79 C6.446,0.833 6.247,0.633 6.1,0.633 C5.754,0.633 5.555,0.833 5.555,1.79 C5.555,4.257 4.11,5.801 0.834,5.801 C0.588,5.801 0.388,6.1 0.388,6.247 C0.388,6.493 0.588,6.692 0.834,6.692 C4.11,6.692 5.555,8.237 5.555,11.414 C5.555,11.660 5.754,11.859 6.1,11.859 C6.247,11.859 6.446,11.660 6.446,11.414 C6.446,8.237 7.990,6.692 11.167,6.692 C11.414,6.692 11.613,6.493 11.613,6.247 C11.613,6.1 11.414,5.801 11.167,5.801 Z" />
                        </svg>
                        <span style="overflow: hidden">
                            <p class="pronouns-p">
                                ${pn}
                            </p>
                        </span>
                    </span>
                </span>
                <span class="right">
                    <!-- BADGES GO HERE -->
                </span>
            </div>
            <div class="chat-bubble">
                <div class="message-box">
                    <div class="${is_mod}"></div>
                    <div class="sparkle-glow"></div>
                    <div ${role_style} class="user-message ${emoteOnly}">
                        <p>
                            ${message}
                        </p>
                        <span ${line_style} class="line"></span>
                    </div>
                </div>
                <div class="bottom-right">
                    <span class="dash-1">
                        <svg width="25px" height="5px">
                            <path fill-rule="evenodd" stroke="rgb(12, 10, 16)" stroke-width="5px" stroke-linecap="butt"
                                stroke-linejoin="miter" fill="rgb(12, 10, 16)" d="M0.999,1.0 L23.0,1.0 " />
                        </svg>
                        <svg class="dot" width="29px" height="29px">
                            <defs>
                                <linearGradient id="PSgrad_0" x1="0%" x2="0%" y1="100%" y2="0%">
                                    <stop offset="0%" stop-color="rgb(255,230,161)" stop-opacity="1" />
                                    <stop offset="100%" stop-color="rgb(249,206,131)" stop-opacity="1" />
                                </linearGradient>
                            </defs>
                            <path fill-rule="evenodd" fill="url(#PSgrad_0)"
                                d="M16.2,13.999 C16.2,12.897 15.108,12.3 14.6,12.3 C12.903,12.3 12.9,12.897 12.9,13.999 C12.9,15.102 12.903,15.995 14.6,15.995 C15.108,15.995 16.2,15.102 16.2,13.999 Z" />
                        </svg>
                    </span>
                    <span class="dash-2">
                        <svg width="12px" height="5px">
                            <path fill-rule="evenodd" stroke="rgb(12, 10, 16)" stroke-width="5px" stroke-linecap="butt"
                                stroke-linejoin="miter" fill="rgb(12, 10, 16)" d="M0.999,1.0 L10.0,1.0 " />
                        </svg>
                    </span>
                    <span class="dash-3">
                        <svg width="33px" height="5px">
                            <path fill-rule="evenodd" stroke="rgb(12, 10, 16)" stroke-width="5px" stroke-linecap="butt"
                                stroke-linejoin="miter" fill="rgb(12, 10, 16)" d="M0.999,1.0 L31.0,1.0 " />
                        </svg>
                        <svg class="star" width="73px" height="73px">
                            <path fill-rule="evenodd" fill="rgb(252, 217, 144)"
                                d="M41.167,35.801 C37.991,35.801 36.446,34.257 36.446,31.79 C36.446,30.833 36.247,30.633 36.1,30.633 C35.754,30.633 35.555,30.833 35.555,31.79 C35.555,34.257 34.11,35.801 30.834,35.801 C30.588,35.801 30.388,36.1 30.388,36.247 C30.388,36.493 30.588,36.692 30.834,36.692 C34.11,36.692 35.555,38.237 35.555,41.414 C35.555,41.660 35.754,41.859 36.1,41.859 C36.247,41.859 36.446,41.660 36.446,41.414 C36.446,38.237 37.991,36.692 41.167,36.692 C41.414,36.692 41.613,36.493 41.613,36.247 C41.613,36.1 41.414,35.801 41.167,35.801 Z" />
                        </svg>
                    </span>
                </div>
            </div>
        </div>
    </div>
    `
    const element = $.parseHTML(block_to_append);

    if (hideAfter !== 999) {
        $(element).appendTo('.main-container').delay(hideAfter * 1000 + 300).animate({
            opacity: 0
        }, 'fast', function () {
            $(element).remove();
        });
    } else {
        $(element).appendTo('.main-container');
    }

    setTimeout(() => {
        if ($(`.message-row[data-msgid=${msgId}] .user-message`).width() < 110) {
            $(`.message-row[data-msgid=${msgId}] .dash-1`).remove()
            $(`.message-row[data-msgid=${msgId}] .dash-2`).remove()
        }

        if ($(`.message-row[data-msgid=${msgId}] .user-message`).width() < 150) {
            let rightDistance = 49.86462 + (20 - 49.86462) / (1 + ($(`.message-row[data-msgid=${msgId}] .user-message`).width() / 148.2258) ** 59.40036)
            $(`.message-row[data-msgid=${msgId}] .sparkle-glow`).css('right', rightDistance + 5 + 'px')
            $(`.message-row[data-msgid=${msgId}] .reg-glow`).css('right', rightDistance + 5 + 'px')
            /* rightDistance = 11.61728 + (129.7914 - 11.61728) / (1 + ($(`.message-row[data-msgid=${msgId}] .user-message`).width() / 122.776) ** 5.833576) */
            $(`.message-row[data-msgid=${msgId}] .bottom-right`).css('right', rightDistance + 'px')
        }
      
		let decorLineHeight = $(`.message-row[data-msgid=${msgId}]`).height() - 65 + 'px';
        $(`.message-row[data-msgid=${msgId}] .left-decor .line`).css('height', decorLineHeight);
      	$(`.message-row[data-msgid=${msgId}] .left-decor .moon`).removeClass('animate-moon-in').addClass('animate-moon-idle');
    }, 200)
  
    // Removes messages if the total number 
    // of messages goes over the limit
    if (totalMsg > msgLimit) {
        removeRow();
    }

    adjustColor()
}

function alertSub(username) {
    totalMsg += 1;
    let block_to_append = `
    <div class="alert-wrap">
        <div style="border: solid 2px ${colors.alert_border_color}" class="side-details">
            <svg class="star-1" width="73px" height="73px">
                <path fill-rule="evenodd" fill="#ffe7a1"
                    d="M41.167,35.801 C37.991,35.801 36.446,34.257 36.446,31.79 C36.446,30.833 36.247,30.633 36.1,30.633 C35.754,30.633 35.555,30.833 35.555,31.79 C35.555,34.257 34.11,35.801 30.834,35.801 C30.588,35.801 30.388,36.1 30.388,36.247 C30.388,36.493 30.588,36.692 30.834,36.692 C34.11,36.692 35.555,38.237 35.555,41.414 C35.555,41.660 35.754,41.859 36.1,41.859 C36.247,41.859 36.446,41.660 36.446,41.414 C36.446,38.237 37.991,36.692 41.167,36.692 C41.414,36.692 41.613,36.493 41.613,36.247 C41.613,36.1 41.414,35.801 41.167,35.801 Z" />
            </svg>
            <svg class="star-2" width="73px" height="73px">
                <path fill-rule="evenodd" fill="#ffe7a1"
                    d="M41.167,35.801 C37.991,35.801 36.446,34.257 36.446,31.79 C36.446,30.833 36.247,30.633 36.1,30.633 C35.754,30.633 35.555,30.833 35.555,31.79 C35.555,34.257 34.11,35.801 30.834,35.801 C30.588,35.801 30.388,36.1 30.388,36.247 C30.388,36.493 30.588,36.692 30.834,36.692 C34.11,36.692 35.555,38.237 35.555,41.414 C35.555,41.660 35.754,41.859 36.1,41.859 C36.247,41.859 36.446,41.660 36.446,41.414 C36.446,38.237 37.991,36.692 41.167,36.692 C41.414,36.692 41.613,36.493 41.613,36.247 C41.613,36.1 41.414,35.801 41.167,35.801 Z" />
            </svg>
        </div>
        <div style="background: ${colors.gradient_color}" class="alert">
            <div class="bg-details">
                <img class="details" src="https://i.imgur.com/eJaWvTg.png">
                <svg class="banner" width="14px" height="32px">
                    <defs>
                        <linearGradient id="PSgrad_10" x1="0%" x2="0%" y1="100%" y2="0%">
                            <stop offset="0%" stop-color="rgb(67,31,32)" stop-opacity="1" />
                            <stop offset="100%" stop-color="rgb(45,21,23)" stop-opacity="1" />
                        </linearGradient>

                    </defs>
                    <path fill-rule="evenodd" fill="rgb(44, 21, 23)"
                        d="M0.12,0.1 L0.12,29.568 L0.12,31.241 C0.12,31.754 0.382,32.122 0.772,31.971 L6.821,29.636 C6.937,29.592 7.61,29.592 7.177,29.636 L13.227,31.971 C13.617,32.122 14.12,31.754 14.12,31.241 L14.12,29.568 L14.12,0.1 L0.12,0.1 Z" />
                    <path fill="url(#PSgrad_10)"
                        d="M0.12,0.1 L0.12,29.568 L0.12,31.241 C0.12,31.754 0.382,32.122 0.772,31.971 L6.821,29.636 C6.937,29.592 7.61,29.592 7.177,29.636 L13.227,31.971 C13.617,32.122 14.12,31.754 14.12,31.241 L14.12,29.568 L14.12,0.1 L0.12,0.1 Z" />
                </svg>
            </div>
            <div class="alert-message">
                <p class="alert-username">${username}</p>
                <p> just subscribed</p>
            </div>
        </div>
    </div>
    `

    const element = $.parseHTML(block_to_append);
    if (hideAfter !== 999) {
        $(element).appendTo('.main-container').delay(hideAfter * 1000).animate({
            opacity: 0
        }, 'fast', function () {
            $(element).remove();
        });
    } else {
        $(element).appendTo('.main-container');
    }
}

function alertReSub(username, amount) {
    totalMsg += 1;
    let block_to_append = `
    <div class="alert-wrap">
        <div style="border: solid 2px ${colors.alert_border_color}" class="side-details">
            <svg class="star-1" width="73px" height="73px">
                <path fill-rule="evenodd" fill="#ffe7a1"
                    d="M41.167,35.801 C37.991,35.801 36.446,34.257 36.446,31.79 C36.446,30.833 36.247,30.633 36.1,30.633 C35.754,30.633 35.555,30.833 35.555,31.79 C35.555,34.257 34.11,35.801 30.834,35.801 C30.588,35.801 30.388,36.1 30.388,36.247 C30.388,36.493 30.588,36.692 30.834,36.692 C34.11,36.692 35.555,38.237 35.555,41.414 C35.555,41.660 35.754,41.859 36.1,41.859 C36.247,41.859 36.446,41.660 36.446,41.414 C36.446,38.237 37.991,36.692 41.167,36.692 C41.414,36.692 41.613,36.493 41.613,36.247 C41.613,36.1 41.414,35.801 41.167,35.801 Z" />
            </svg>
            <svg class="star-2" width="73px" height="73px">
                <path fill-rule="evenodd" fill="#ffe7a1"
                    d="M41.167,35.801 C37.991,35.801 36.446,34.257 36.446,31.79 C36.446,30.833 36.247,30.633 36.1,30.633 C35.754,30.633 35.555,30.833 35.555,31.79 C35.555,34.257 34.11,35.801 30.834,35.801 C30.588,35.801 30.388,36.1 30.388,36.247 C30.388,36.493 30.588,36.692 30.834,36.692 C34.11,36.692 35.555,38.237 35.555,41.414 C35.555,41.660 35.754,41.859 36.1,41.859 C36.247,41.859 36.446,41.660 36.446,41.414 C36.446,38.237 37.991,36.692 41.167,36.692 C41.414,36.692 41.613,36.493 41.613,36.247 C41.613,36.1 41.414,35.801 41.167,35.801 Z" />
            </svg>
        </div>
        <div style="background: ${colors.gradient_color}" class="alert">
            <div class="bg-details">
                <img class="details" src="https://i.imgur.com/eJaWvTg.png">
                <svg class="banner" width="14px" height="32px">
                    <defs>
                        <linearGradient id="PSgrad_10" x1="0%" x2="0%" y1="100%" y2="0%">
                            <stop offset="0%" stop-color="rgb(67,31,32)" stop-opacity="1" />
                            <stop offset="100%" stop-color="rgb(45,21,23)" stop-opacity="1" />
                        </linearGradient>

                    </defs>
                    <path fill-rule="evenodd" fill="rgb(44, 21, 23)"
                        d="M0.12,0.1 L0.12,29.568 L0.12,31.241 C0.12,31.754 0.382,32.122 0.772,31.971 L6.821,29.636 C6.937,29.592 7.61,29.592 7.177,29.636 L13.227,31.971 C13.617,32.122 14.12,31.754 14.12,31.241 L14.12,29.568 L14.12,0.1 L0.12,0.1 Z" />
                    <path fill="url(#PSgrad_10)"
                        d="M0.12,0.1 L0.12,29.568 L0.12,31.241 C0.12,31.754 0.382,32.122 0.772,31.971 L6.821,29.636 C6.937,29.592 7.61,29.592 7.177,29.636 L13.227,31.971 C13.617,32.122 14.12,31.754 14.12,31.241 L14.12,29.568 L14.12,0.1 L0.12,0.1 Z" />
                </svg>
            </div>
            <div class="alert-message">
                <p class="alert-username">${username}</p>
                <p> resubscribed for </p>
                <p class="alert-username">${amount} months</p>
            </div>
        </div>
    </div>
    `

    const element = $.parseHTML(block_to_append);
    if (hideAfter !== 999) {
        $(element).appendTo('.main-container').delay(hideAfter * 1000).animate({
            opacity: 0
        }, 'fast', function () {
            $(element).remove();
        });
    } else {
        $(element).appendTo('.main-container');
    }
}

function alertBulkGift(username, amount) {
    totalMsg += 1;
    let block_to_append = `
    <div class="alert-wrap">
        <div style="border: solid 2px ${colors.alert_border_color}" class="side-details">
            <svg class="star-1" width="73px" height="73px">
                <path fill-rule="evenodd" fill="#ffe7a1"
                    d="M41.167,35.801 C37.991,35.801 36.446,34.257 36.446,31.79 C36.446,30.833 36.247,30.633 36.1,30.633 C35.754,30.633 35.555,30.833 35.555,31.79 C35.555,34.257 34.11,35.801 30.834,35.801 C30.588,35.801 30.388,36.1 30.388,36.247 C30.388,36.493 30.588,36.692 30.834,36.692 C34.11,36.692 35.555,38.237 35.555,41.414 C35.555,41.660 35.754,41.859 36.1,41.859 C36.247,41.859 36.446,41.660 36.446,41.414 C36.446,38.237 37.991,36.692 41.167,36.692 C41.414,36.692 41.613,36.493 41.613,36.247 C41.613,36.1 41.414,35.801 41.167,35.801 Z" />
            </svg>
            <svg class="star-2" width="73px" height="73px">
                <path fill-rule="evenodd" fill="#ffe7a1"
                    d="M41.167,35.801 C37.991,35.801 36.446,34.257 36.446,31.79 C36.446,30.833 36.247,30.633 36.1,30.633 C35.754,30.633 35.555,30.833 35.555,31.79 C35.555,34.257 34.11,35.801 30.834,35.801 C30.588,35.801 30.388,36.1 30.388,36.247 C30.388,36.493 30.588,36.692 30.834,36.692 C34.11,36.692 35.555,38.237 35.555,41.414 C35.555,41.660 35.754,41.859 36.1,41.859 C36.247,41.859 36.446,41.660 36.446,41.414 C36.446,38.237 37.991,36.692 41.167,36.692 C41.414,36.692 41.613,36.493 41.613,36.247 C41.613,36.1 41.414,35.801 41.167,35.801 Z" />
            </svg>
        </div>
        <div style="background: ${colors.gradient_color}" class="alert">
            <div class="bg-details">
                <img class="details" src="https://i.imgur.com/eJaWvTg.png">
                <svg class="banner" width="14px" height="32px">
                    <defs>
                        <linearGradient id="PSgrad_10" x1="0%" x2="0%" y1="100%" y2="0%">
                            <stop offset="0%" stop-color="rgb(67,31,32)" stop-opacity="1" />
                            <stop offset="100%" stop-color="rgb(45,21,23)" stop-opacity="1" />
                        </linearGradient>

                    </defs>
                    <path fill-rule="evenodd" fill="rgb(44, 21, 23)"
                        d="M0.12,0.1 L0.12,29.568 L0.12,31.241 C0.12,31.754 0.382,32.122 0.772,31.971 L6.821,29.636 C6.937,29.592 7.61,29.592 7.177,29.636 L13.227,31.971 C13.617,32.122 14.12,31.754 14.12,31.241 L14.12,29.568 L14.12,0.1 L0.12,0.1 Z" />
                    <path fill="url(#PSgrad_10)"
                        d="M0.12,0.1 L0.12,29.568 L0.12,31.241 C0.12,31.754 0.382,32.122 0.772,31.971 L6.821,29.636 C6.937,29.592 7.61,29.592 7.177,29.636 L13.227,31.971 C13.617,32.122 14.12,31.754 14.12,31.241 L14.12,29.568 L14.12,0.1 L0.12,0.1 Z" />
                </svg>
            </div>
            <div class="alert-message">
                <p class="alert-username">${username}</p>
                <p> gifted </p>
                <p class="alert-username">${amount} subs</p>
                <p> to the community</p>
            </div>
        </div>
    </div>
    `

    const element = $.parseHTML(block_to_append);
    if (hideAfter !== 999) {
        $(element).appendTo('.main-container').delay(hideAfter * 1000).animate({
            opacity: 0
        }, 'fast', function () {
            $(element).remove();
        });
    } else {
        $(element).appendTo('.main-container');
    }
}

function alertGift(sender, target) {
    totalMsg += 1;
    let block_to_append = `
    <div class="alert-wrap">
        <div style="border: solid 2px ${colors.alert_border_color}" class="side-details">
            <svg class="star-1" width="73px" height="73px">
                <path fill-rule="evenodd" fill="#ffe7a1"
                    d="M41.167,35.801 C37.991,35.801 36.446,34.257 36.446,31.79 C36.446,30.833 36.247,30.633 36.1,30.633 C35.754,30.633 35.555,30.833 35.555,31.79 C35.555,34.257 34.11,35.801 30.834,35.801 C30.588,35.801 30.388,36.1 30.388,36.247 C30.388,36.493 30.588,36.692 30.834,36.692 C34.11,36.692 35.555,38.237 35.555,41.414 C35.555,41.660 35.754,41.859 36.1,41.859 C36.247,41.859 36.446,41.660 36.446,41.414 C36.446,38.237 37.991,36.692 41.167,36.692 C41.414,36.692 41.613,36.493 41.613,36.247 C41.613,36.1 41.414,35.801 41.167,35.801 Z" />
            </svg>
            <svg class="star-2" width="73px" height="73px">
                <path fill-rule="evenodd" fill="#ffe7a1"
                    d="M41.167,35.801 C37.991,35.801 36.446,34.257 36.446,31.79 C36.446,30.833 36.247,30.633 36.1,30.633 C35.754,30.633 35.555,30.833 35.555,31.79 C35.555,34.257 34.11,35.801 30.834,35.801 C30.588,35.801 30.388,36.1 30.388,36.247 C30.388,36.493 30.588,36.692 30.834,36.692 C34.11,36.692 35.555,38.237 35.555,41.414 C35.555,41.660 35.754,41.859 36.1,41.859 C36.247,41.859 36.446,41.660 36.446,41.414 C36.446,38.237 37.991,36.692 41.167,36.692 C41.414,36.692 41.613,36.493 41.613,36.247 C41.613,36.1 41.414,35.801 41.167,35.801 Z" />
            </svg>
        </div>
        <div style="background: ${colors.gradient_color}" class="alert">
            <div class="bg-details">
                <img class="details" src="https://i.imgur.com/eJaWvTg.png">
                <svg class="banner" width="14px" height="32px">
                    <defs>
                        <linearGradient id="PSgrad_10" x1="0%" x2="0%" y1="100%" y2="0%">
                            <stop offset="0%" stop-color="rgb(67,31,32)" stop-opacity="1" />
                            <stop offset="100%" stop-color="rgb(45,21,23)" stop-opacity="1" />
                        </linearGradient>

                    </defs>
                    <path fill-rule="evenodd" fill="rgb(44, 21, 23)"
                        d="M0.12,0.1 L0.12,29.568 L0.12,31.241 C0.12,31.754 0.382,32.122 0.772,31.971 L6.821,29.636 C6.937,29.592 7.61,29.592 7.177,29.636 L13.227,31.971 C13.617,32.122 14.12,31.754 14.12,31.241 L14.12,29.568 L14.12,0.1 L0.12,0.1 Z" />
                    <path fill="url(#PSgrad_10)"
                        d="M0.12,0.1 L0.12,29.568 L0.12,31.241 C0.12,31.754 0.382,32.122 0.772,31.971 L6.821,29.636 C6.937,29.592 7.61,29.592 7.177,29.636 L13.227,31.971 C13.617,32.122 14.12,31.754 14.12,31.241 L14.12,29.568 L14.12,0.1 L0.12,0.1 Z" />
                </svg>
            </div>
            <div class="alert-message">
                <p class="alert-username">${sender}</p>
                <p> gifted a sub to </p>
                <p class="alert-username">${target}</p>
            </div>
        </div>
    </div>
    `

    const element = $.parseHTML(block_to_append);
    if (hideAfter !== 999) {
        $(element).appendTo('.main-container').delay(hideAfter * 1000).animate({
            opacity: 0
        }, 'fast', function () {
            $(element).remove();
        });
    } else {
        $(element).appendTo('.main-container');
    }
}

function alertCheer(username, amount) {
    totalMsg += 1;
    let block_to_append = `
    <div class="alert-wrap">
        <div style="border: solid 2px ${colors.alert_border_color}" class="side-details">
            <svg class="star-1" width="73px" height="73px">
                <path fill-rule="evenodd" fill="#ffe7a1"
                    d="M41.167,35.801 C37.991,35.801 36.446,34.257 36.446,31.79 C36.446,30.833 36.247,30.633 36.1,30.633 C35.754,30.633 35.555,30.833 35.555,31.79 C35.555,34.257 34.11,35.801 30.834,35.801 C30.588,35.801 30.388,36.1 30.388,36.247 C30.388,36.493 30.588,36.692 30.834,36.692 C34.11,36.692 35.555,38.237 35.555,41.414 C35.555,41.660 35.754,41.859 36.1,41.859 C36.247,41.859 36.446,41.660 36.446,41.414 C36.446,38.237 37.991,36.692 41.167,36.692 C41.414,36.692 41.613,36.493 41.613,36.247 C41.613,36.1 41.414,35.801 41.167,35.801 Z" />
            </svg>
            <svg class="star-2" width="73px" height="73px">
                <path fill-rule="evenodd" fill="#ffe7a1"
                    d="M41.167,35.801 C37.991,35.801 36.446,34.257 36.446,31.79 C36.446,30.833 36.247,30.633 36.1,30.633 C35.754,30.633 35.555,30.833 35.555,31.79 C35.555,34.257 34.11,35.801 30.834,35.801 C30.588,35.801 30.388,36.1 30.388,36.247 C30.388,36.493 30.588,36.692 30.834,36.692 C34.11,36.692 35.555,38.237 35.555,41.414 C35.555,41.660 35.754,41.859 36.1,41.859 C36.247,41.859 36.446,41.660 36.446,41.414 C36.446,38.237 37.991,36.692 41.167,36.692 C41.414,36.692 41.613,36.493 41.613,36.247 C41.613,36.1 41.414,35.801 41.167,35.801 Z" />
            </svg>
        </div>
        <div style="background: ${colors.gradient_color}" class="alert">
            <div class="bg-details">
                <img class="details" src="https://i.imgur.com/eJaWvTg.png">
                <svg class="banner" width="14px" height="32px">
                    <defs>
                        <linearGradient id="PSgrad_10" x1="0%" x2="0%" y1="100%" y2="0%">
                            <stop offset="0%" stop-color="rgb(67,31,32)" stop-opacity="1" />
                            <stop offset="100%" stop-color="rgb(45,21,23)" stop-opacity="1" />
                        </linearGradient>

                    </defs>
                    <path fill-rule="evenodd" fill="rgb(44, 21, 23)"
                        d="M0.12,0.1 L0.12,29.568 L0.12,31.241 C0.12,31.754 0.382,32.122 0.772,31.971 L6.821,29.636 C6.937,29.592 7.61,29.592 7.177,29.636 L13.227,31.971 C13.617,32.122 14.12,31.754 14.12,31.241 L14.12,29.568 L14.12,0.1 L0.12,0.1 Z" />
                    <path fill="url(#PSgrad_10)"
                        d="M0.12,0.1 L0.12,29.568 L0.12,31.241 C0.12,31.754 0.382,32.122 0.772,31.971 L6.821,29.636 C6.937,29.592 7.61,29.592 7.177,29.636 L13.227,31.971 C13.617,32.122 14.12,31.754 14.12,31.241 L14.12,29.568 L14.12,0.1 L0.12,0.1 Z" />
                </svg>
            </div>
            <div class="alert-message">
                <p class="alert-username">${username}</p>
                <p> cheered with </p>
                <p class="alert-username">${amount} bits</p>
            </div>
        </div>
    </div>
    `

    const element = $.parseHTML(block_to_append);
    if (hideAfter !== 999) {
        $(element).appendTo('.main-container').delay(hideAfter * 1000).animate({
            opacity: 0
        }, 'fast', function () {
            $(element).remove();
        });
    } else {
        $(element).appendTo('.main-container');
    }
}

function alertTip(username, amount) {
    totalMsg += 1;
    let block_to_append = `
    <div class="alert-wrap">
        <div style="border: solid 2px ${colors.alert_border_color}" class="side-details">
            <svg class="star-1" width="73px" height="73px">
                <path fill-rule="evenodd" fill="#ffe7a1"
                    d="M41.167,35.801 C37.991,35.801 36.446,34.257 36.446,31.79 C36.446,30.833 36.247,30.633 36.1,30.633 C35.754,30.633 35.555,30.833 35.555,31.79 C35.555,34.257 34.11,35.801 30.834,35.801 C30.588,35.801 30.388,36.1 30.388,36.247 C30.388,36.493 30.588,36.692 30.834,36.692 C34.11,36.692 35.555,38.237 35.555,41.414 C35.555,41.660 35.754,41.859 36.1,41.859 C36.247,41.859 36.446,41.660 36.446,41.414 C36.446,38.237 37.991,36.692 41.167,36.692 C41.414,36.692 41.613,36.493 41.613,36.247 C41.613,36.1 41.414,35.801 41.167,35.801 Z" />
            </svg>
            <svg class="star-2" width="73px" height="73px">
                <path fill-rule="evenodd" fill="#ffe7a1"
                    d="M41.167,35.801 C37.991,35.801 36.446,34.257 36.446,31.79 C36.446,30.833 36.247,30.633 36.1,30.633 C35.754,30.633 35.555,30.833 35.555,31.79 C35.555,34.257 34.11,35.801 30.834,35.801 C30.588,35.801 30.388,36.1 30.388,36.247 C30.388,36.493 30.588,36.692 30.834,36.692 C34.11,36.692 35.555,38.237 35.555,41.414 C35.555,41.660 35.754,41.859 36.1,41.859 C36.247,41.859 36.446,41.660 36.446,41.414 C36.446,38.237 37.991,36.692 41.167,36.692 C41.414,36.692 41.613,36.493 41.613,36.247 C41.613,36.1 41.414,35.801 41.167,35.801 Z" />
            </svg>
        </div>
        <div style="background: ${colors.gradient_color}" class="alert">
            <div class="bg-details">
                <img class="details" src="https://i.imgur.com/eJaWvTg.png">
                <svg class="banner" width="14px" height="32px">
                    <defs>
                        <linearGradient id="PSgrad_10" x1="0%" x2="0%" y1="100%" y2="0%">
                            <stop offset="0%" stop-color="rgb(67,31,32)" stop-opacity="1" />
                            <stop offset="100%" stop-color="rgb(45,21,23)" stop-opacity="1" />
                        </linearGradient>

                    </defs>
                    <path fill-rule="evenodd" fill="rgb(44, 21, 23)"
                        d="M0.12,0.1 L0.12,29.568 L0.12,31.241 C0.12,31.754 0.382,32.122 0.772,31.971 L6.821,29.636 C6.937,29.592 7.61,29.592 7.177,29.636 L13.227,31.971 C13.617,32.122 14.12,31.754 14.12,31.241 L14.12,29.568 L14.12,0.1 L0.12,0.1 Z" />
                    <path fill="url(#PSgrad_10)"
                        d="M0.12,0.1 L0.12,29.568 L0.12,31.241 C0.12,31.754 0.382,32.122 0.772,31.971 L6.821,29.636 C6.937,29.592 7.61,29.592 7.177,29.636 L13.227,31.971 C13.617,32.122 14.12,31.754 14.12,31.241 L14.12,29.568 L14.12,0.1 L0.12,0.1 Z" />
                </svg>
            </div>
            <div class="alert-message">
                <p class="alert-username">${username}</p>
                <p> tipped </p>
                <p class="alert-username">${events.tip.currency}${amount}</p>
            </div>
        </div>
    </div>
    `

    const element = $.parseHTML(block_to_append);
    if (hideAfter !== 999) {
        $(element).appendTo('.main-container').delay(hideAfter * 1000).animate({
            opacity: 0
        }, 'fast', function () {
            $(element).remove();
        });
    } else {
        $(element).appendTo('.main-container');
    }
}

// A set of helper functions to handle emotes
function attachEmotes(message) {
    let text = html_encode(message.text);
    let data = message.emotes;
    if (data[0]) {
        hasEmotes = "has-emotes"
    } else {
        hasEmotes = ""
    }
    let isEmoteOnly = message.tags['emote-only']
    if (typeof message.attachment !== "undefined") {
        if (typeof message.attachment.media !== "undefined") {
            if (typeof message.attachment.media.image !== "undefined") {
                text = `${message.text}<img src="${message.attachment.media.image.src}">`;
            }
        }
    }
    return text
        .replace(
            /([^\s]*)/gi,
            function (m, key) {
                let result = data.filter(emote => {
                    return html_encode(emote.name) === key
                });
                if (typeof result[0] !== "undefined") {
                    let url;
                    if (isEmoteOnly) {
                        url = result[0]['urls'][4];
                        console.log('emote only')
                    } else {
                        url = result[0]['urls'][1];
                        console.log('not emote only')
                    }
                    if (provider === "twitch") {
                        return `<img class="emote" src="${url}"/>`;
                    } else {
                        if (typeof result[0].coords === "undefined") {
                            result[0].coords = {
                                x: 0,
                                y: 0
                            };
                        }
                        let x = parseInt(result[0].coords.x);
                        let y = parseInt(result[0].coords.y);

                        let width = "28px";
                        let height = "auto";

                        if (provider === "mixer") {
                            console.log(result[0]);
                            if (result[0].coords.width) {
                                width = `${result[0].coords.width}px`;
                            }
                            if (result[0].coords.height) {
                                height = `${result[0].coords.height}px`;
                            }
                        }
                        return `<div class="emote" style="width: ${width}; height:${height}; display: inline-block; background-image: url(${url}); background-position: -${x}px -${y}px;"></div>`;
                    }
                } else return key;

            }
        );
}

function adjustColor() {
    switch (theme) {
        case "gold":
            colors.mod_border_color = "#f8c779";
            colors.mod_line_color = "#f8c77970";
            colors.sub_border_color = "#71638e";
            colors.sub_line_color = "#71638e70";
            colors.alert_border_color = "#f8c779";
            break;
        case "lavender":
            $('.alert-wrap').css('filter', 'hue-rotate(-135deg) saturate(85%)');

            $('.icon-wrap .moon').css('filter', 'hue-rotate(-135deg) saturate(85%)');
            $('.username').css('filter', 'hue-rotate(-135deg) saturate(85%)');
            $('.dot').css('filter', 'hue-rotate(-135deg) saturate(85%)');
            $('.star').css('filter', 'hue-rotate(-135deg) saturate(85%)');
            $('.glow').css('filter', 'blur(40px) hue-rotate(-135deg) saturate(85%)');
            $('.sparkle-glow').css('filter', 'blur(11px) hue-rotate(-135deg) saturate(85%)');
            colors.mod_border_color = "#caa5f8";
            colors.mod_line_color = "#caa5f870";
            colors.sub_border_color = "#71638e";
            colors.sub_line_color = "#71638e70";
            colors.alert_border_color = "#f8c779";
            break;
        case "peach":
            $('.alert-wrap').css('filter', 'hue-rotate(-45deg) saturate(100%)');

            $('.icon-wrap .moon').css('filter', 'hue-rotate(-45deg) saturate(100%)');
            $('.username').css('filter', 'hue-rotate(-45deg) saturate(100%)');
            $('.dot').css('filter', 'hue-rotate(-45deg) saturate(100%)');
            $('.star').css('filter', 'hue-rotate(-45deg) saturate(100%)');
            colors.mod_border_color = "#ffa1a1";
            colors.mod_line_color = "#ffa1a170";
            colors.sub_border_color = "#71638e";
            colors.sub_line_color = "#71638e70";
            colors.alert_border_color = "#f8c779";
            break;
        case "own":
            let r = parseInt(customAccent.split(',')[0].split('(')[1])
            let g = parseInt(customAccent.split(',')[1])
            let b = parseInt(customAccent.split(',')[2].split(')')[0])
            let hue_accent = rgb2hsv(r, g, b)
            let hue_target = hue_accent.h - 45;
            $('.alert-wrap').css('filter', 'hue-rotate(' + hue_target + 'deg) saturate(85%)');
            $('.alert-wrap .side-details').css('filter', 'hue-rotate(' + -1 * hue_target + 'deg) saturate(115%)');
            $('.alert-wrap .star-1').css('filter', 'hue-rotate(' + hue_target + 'deg) saturate(85%)');
            $('.alert-wrap .star-2').css('filter', 'hue-rotate(' + hue_target + 'deg) saturate(85%)');

            $('.icon-wrap .moon').css('filter', 'hue-rotate(' + hue_target + 'deg) saturate(85%)');
            $('.username').css('filter', 'hue-rotate(' + hue_target + 'deg) saturate(85%)');
            $('.dot').css('filter', 'hue-rotate(' + hue_target + 'deg) saturate(85%)');
            $('.star').css('filter', 'hue-rotate(' + hue_target + 'deg) saturate(85%)');
            $('.glow').css('filter', 'blur(40px) hue-rotate(' + hue_target + 'deg) saturate(85%)');
            $('.sparkle-glow').css('filter', 'blur(11px) hue-rotate(' + hue_target + 'deg) saturate(85%)');

            colors.mod_border_color = customAccent;
            colors.mod_line_color = customAccent;
            colors.sub_border_color = "#71638e";
            colors.sub_line_color = "#71638e70";
            colors.alert_border_color = customAccent;
            break;
    }
}

function html_encode(e) {
    return e.replace(/[<>"^]/g, function (e) {
        return "&#" + e.charCodeAt(0) + ";";
    });
}

function check_role(data) {
    let badges = data.tags.badges;
    if (badges.includes('broadcaster')) {
        return 'broadcaster'
    } else if (badges.includes('moderator')) {
        return 'moderator'
    } else if (badges.includes('subscriber')) {
        return 'subscriber'
    } else {
        return
    }

}

function removeRow() {
    if (!$(removeSelector).length) {
        return;
    }

    $(removeSelector).animate({
        opacity: 0
    }, 'fast', function () {
        $(removeSelector).remove();
    });
}

// i wish there was a less stupid way to do this.. but at least it's
// in alphabetic order!
async function beautifyPronouns(p, __p) {
    p = await __p;
    switch (p) {
        case "aeaer":
            p = "ae/aer";
            break;
        case "eem":
            p = "e/em";
            break;
        case "faefaer":
            p = "fae/faer";
            break;
        case "hehim":
            p = "he/him";
            break;
        case "heshe":
            p = "he/she";
            break;
        case "hethem":
            p = "he/they";
            break;
        case "itits":
            p = "it/its";
            break;
        case "perper":
            p = "per/per";
            break;
        case "sheher":
            p = "she/her";
            break;
        case "shethem":
            p = "she/they";
            break;
        case "theythem":
            p = "they/them";
            break;
        case "vever":
            p = "ve/ver";
            break;
        case "xexem":
            p = "xe/xem";
            break;
        case "ziehir":
            p = "zie/hir";
            break;
        default:
            break;
    }
    return p;
}

function rgb2hsv(r, g, b) {
    let rabs, gabs, babs, rr, gg, bb, h, s, v, diff, diffc, percentRoundFn;
    rabs = r / 255;
    gabs = g / 255;
    babs = b / 255;
    v = Math.max(rabs, gabs, babs),
        diff = v - Math.min(rabs, gabs, babs);
    diffc = c => (v - c) / 6 / diff + 1 / 2;
    percentRoundFn = num => Math.round(num * 100) / 100;
    if (diff == 0) {
        h = s = 0;
    } else {
        s = diff / v;
        rr = diffc(rabs);
        gg = diffc(gabs);
        bb = diffc(babs);

        if (rabs === v) {
            h = bb - gg;
        } else if (gabs === v) {
            h = (1 / 3) + rr - bb;
        } else if (babs === v) {
            h = (2 / 3) + gg - rr;
        }
        if (h < 0) {
            h += 1;
        } else if (h > 1) {
            h -= 1;
        }
    }
    return {
        h: Math.round(h * 360),
        s: percentRoundFn(s * 100),
        v: percentRoundFn(v * 100)
    };
}

function isEmote(data) {
    let msg = data.text;
    msg = msg.replace(/\s\s+/g, ' ');
    let msg_split = msg.split(" ");


    let emotes = data.emotes;
    let emote_names = [];

    let emoteOnly = true;

    for (let j = 0; j < emotes.length; j++) {
        emote_names.push(emotes[j].name)
    }

    console.log(emote_names)

    for (let i = 0; i < msg_split.length; i++) {
        console.log(msg_split[i])

        if (!emote_names.includes(msg_split[i])) {
            emoteOnly = false
        }
    }
    return emoteOnly;
}