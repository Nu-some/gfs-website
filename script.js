// script.js — shared logic for apples, pears & citrus

(function () {
  // 1. Which fruit type is this page?
  var body = document.body;
  var fruitKind = body.getAttribute("data-fruit") || "apple";
  // Map fruit types to their respective JSON files. Default to apples.json.
  var fileMap = {
  apple: "apples.json",
  pear: "pears.json",
  citrus: "citrus.json",
  stone: "stonefruits.json"
};

  var jsonFile = fileMap[fruitKind] || "apples.json";

  // 2. Grab all the DOM elements we need.  We try the more generic
  // `fruitName`/`fruitDesc`/`fruitImg` ids first so other pages don't
  // need to refer to "apple" elements.  If those aren't found we
  // fall back to the original IDs for backwards compatibility.
  var nameEl   = document.getElementById("fruitName") || document.getElementById("appleName");
  var descEl   = document.getElementById("fruitDesc") || document.getElementById("appleDesc");
  var imgEl    = document.getElementById("fruitImg") || document.getElementById("appleImg");
  var glowEl   = document.getElementById("bgGlow");
  var specsEl  = document.getElementById("specs");
  var menu     = document.getElementById("menu");
  var learnBtn = document.getElementById("learnMoreBtn");

  var dlg      = document.getElementById("infoDialog");
  var dlgTitle = document.getElementById("dlgTitle");
  var dlgSub   = document.getElementById("dlgSub");
  var dlgBody  = document.getElementById("dlgBody");

  // Will hold apples.json, pears.json or citrus.json contents
  var fruits = {};

  // Inline fallback data for apples, pears and citrus.  If fetch() fails
  // (for example when the page is opened directly from the filesystem and
  // browsers block the fetch request), we fall back to this data.  This
  // mirrors the contents of the external JSON files and ensures the site
  // continues to work offline.
  var localData = {
    apple: {
      "granny": {
        "name": "Granny Smith",
        "desc": "Tangy green, crisp and juicy — perfect for a zesty umbrella.",
        "full": "First discovered in Australia in the 1860s, are famous for their bright green skin and tangy flavor. Their firm, juicy texture makes them ideal for both fresh eating and baking. Loved worldwide, they remain a cornerstone of South Africa’s export apple varieties.",
        "img": "assets/granny.png",
        "glow": "limegreen",
        "specs": [
          ["Mar–Jan", "Harvest"],
          ["Tangy", "Taste"],
          ["Juicy/Firm", "Crunch"]
        ]
      },
      "braeburn": {
        "name": "Braeburn",
        "desc": "Red‑orange streaks, aromatic and balanced sweet‑tart flavor.",
        "full": "Braeburn apples, first discovered in New Zealand in the 1950s, are known for their red‑orange streaks over a green‑yellow background. They deliver a crisp, juicy bite with a well‑balanced sweet‑tart flavor. Versatile and aromatic, they are excellent for eating fresh or cooking.",
        "img": "assets/braeburn.png",
        "glow": "orangered",
        "specs": [
          ["Mar–Oct", "Harvest"],
          ["Sweet/Tart", "Taste"],
          ["High", "Crunch"]
        ]
      },
      "cripps": {
        "name": "Cripps Red",
        "desc": "Deep red, crunchy and refreshing with balanced flavor.",
        "full": "Cripps’ Red apples, developed in Australia, are prized for their vibrant deep red color and extra crunchy texture. They have a balanced sweet‑tart flavor, making them refreshing and long‑lasting in storage. In South Africa, they are marketed as Joya® and enjoyed well into summer.",
        "img": "assets/cripps.png",
        "glow": "crimson",
        "specs": [
          ["May–Jan", "Harvest"],
          ["Sweet/Tart", "Taste"],
          ["Extra crunchy", "Crunch"]
        ]
      },
      "pinklady": {
        "name": "Pink Lady",
        "desc": "Striking pink blush with a lively sweet‑tart bite.",
        "full": "Pink Lady apples, developed in Australia, are renowned for their striking pink blush over a golden‑green base. They offer a crisp bite with a lively balance of sweetness and tartness. Known for excellent storage life, they are a premium choice in both local and export markets.",
        "img": "assets/pinklady.png",
        "glow": "pink",
        "specs": [
          ["Apr–Dec", "Harvest"],
          ["Sweet/Tart", "Taste"],
          ["Crisp", "Crunch"]
        ]
      },
      "gala": {
        "name": "Gala",
        "desc": "Mildly sweet and friendly; a crowd favorite.",
        "full": "Gala shares the naturally sweet character of the Royal Gala line and is widely favored for its pleasant flavor and crunch. It remains a staple in many markets for fresh snacking.",
        "img": "assets/gala.png",
        "glow": "coral",
        "specs": [
          ["Feb–Nov", "Harvest"],
          ["Sweet", "Taste"],
          ["Medium", "Crunch"]
        ]
      },
      "royalgala": {
        "name": "Royal Gala",
        "desc": "Vibrant red mutation of Gala — sweet and crisp.",
        "full": "Royal Gala apples are a vibrant red mutation of the Gala variety, first introduced to South Africa in the 1970s. Known for their crisp texture and naturally sweet flavor, they quickly won global popularity. Today, mutations like Royal Beaut and BigBucks make them one of the most widely planted and traded apples worldwide.",
        "img": "assets/royalgala.png",
        "glow": "red",
        "specs": [
          ["Feb–Nov", "Harvest"],
          ["Sweet", "Taste"],
          ["Medium–High", "Crunch"]
        ]
      },
      "golden": {
        "name": "Golden Delicious",
        "desc": "Smooth golden skin with honey‑sweet flavor.",
        "full": "Golden Delicious apples are easily recognized by their smooth golden‑yellow skin and honey‑sweet flavor. With a crisp yet tender bite, they are perfect for snacking, salads, and baking. They remain a popular variety globally thanks to their balanced sweetness and versatility.",
        "img": "assets/golden.png",
        "glow": "gold",
        "specs": [
          ["Feb–Jan", "Harvest"],
          ["Sweet", "Taste"],
          ["Crisp/Tender", "Crunch"]
        ]
      },
      "fuji": {
        "name": "Fuji",
        "desc": "Dense, crisp and richly sweet with honey notes.",
        "full": "Fuji apples, originally bred in Japan, are celebrated for their dense, crisp texture and rich sweetness with subtle honey notes. They have excellent keeping quality and broad consumer appeal.",
        "img": "assets/redfuji.png",
        "glow": "darkred",
        "specs": [
          ["Mar–Dec", "Harvest"],
          ["Sweet", "Taste"],
          ["Dense/Crisp", "Crunch"]
        ]
      },
      "redfuji": {
        "name": "Red Fuji",
        "desc": "Rosy‑red blush; long shelf life and rich sweetness.",
        "full": "Red Fuji apples, originally bred in Japan, are famous for their large size, rosy‑red blush, and long shelf life. They have a dense, crisp texture with a rich sweetness and subtle honey notes. A favorite worldwide, they are especially valued for export due to their durability and flavor.",
        "img": "assets/redfuji.png",
        "glow": "firebrick",
        "specs": [
          ["Mar–Dec", "Harvest"],
          ["Sweet/Honey", "Taste"],
          ["Crisp", "Crunch"]
        ]
      },
      "topred": {
        "name": "Top Red",
        "desc": "Elongated, firm apples with mild sweetness.",
        "full": "Top Red apples are a richly colored red strain, developed as a mutation of Red Delicious. They are known for their elongated shape, firm texture, and mild sweetness. Popular in both local and export markets, they add variety and visual appeal to the apple mix.",
        "img": "assets/topred.png",
        "glow": "darkred",
        "specs": [
          ["Mar–Dec", "Harvest"],
          ["Mildly Sweet", "Taste"],
          ["Firm", "Crunch"]
        ]
      }
    },
    pear: {
      "abate": {
        "name": "Abate Fetel",
        "desc": "Elegant long-necked pear with honey-sweet, buttery bite.",
        "full": "Abate Fetel pears have an elongated, elegant neck and yellow-green skin, often brushed with light pink and fine russet freckles. The creamy white flesh stays semi-crisp yet velvety and buttery, delivering a sweet, aromatic flavour with gentle honey notes.",
        "img": "assets/pear-abate.png",
        "glow": "#d3a84f",
        "specs": [
          ["Late Jan", "Harvest"],
          ["Honey-sweet/Aromatic", "Taste"],
          ["Semi-crisp/Buttery", "Texture"]
        ]
      },
      "boncretien": {
        "name": "Bon Chrétien",
        "desc": "Classic, widely grown pear with sweet, creamy flesh.",
        "full": "Bon Chrétien is a medium to large, slightly irregular pear with a rounded base and small neck. Its skin turns from green to pale yellow as it ripens, marked by russet patches and visible lenticels. The white to ivory flesh is juicy, fine-grained and creamy, ideal for fresh eating as well as baking, drying and preserving.",
        "img": "assets/pear-boncretien.png",
        "glow": "#bcd85a",
        "specs": [
          ["Jan–Feb", "Harvest"],
          ["Sweet/Aromatic", "Taste"],
          ["Juicy/Creamy", "Texture"]
        ]
      },
      "forelle": {
        "name": "Forelle",
        "desc": "Small, speckled pear with crisp, sweet flesh.",
        "full": "Forelle pears are small, symmetrical and bell-shaped, with smooth thin skin that shifts from green to yellow as it ripens. A red blush and bright crimson speckles give it a distinctive look. The creamy white flesh is dense, slightly coarse and crisp, with a sweet flavour and a gentle hint of cinnamon.",
        "img": "assets/pear-forelle.png",
        "glow": "#f1c85a",
        "specs": [
          ["Mar–May", "Harvest"],
          ["Sweet w/ spice hint", "Taste"],
          ["Crisp/Dense", "Texture"]
        ]
      },
      "packham": {
        "name": "Packham's Triumph",
        "desc": "Large, knobbly pear with very sweet fine-textured flesh.",
        "full": "Packham’s Triumph pears are large and often irregular in shape, with a bumpy, characterful surface. Even when ripe, the skin stays green-yellow. The creamy white flesh is finely textured and very sweet, making it one of the most popular pears for fresh eating, salads and baking.",
        "img": "assets/pear-packham.png",
        "glow": "#a5d84f",
        "specs": [
          ["Late Jan–Late Jul", "Harvest"],
          ["Sweet", "Taste"],
          ["Fine/Creamy", "Texture"]
        ]
      },
      "rosemarie": {
        "name": "Rosemarie",
        "desc": "Handsome blushed pear, sweet and very juicy.",
        "full": "Rosemarie is a slightly stocky pear with smooth skin and an attractive orange-red to pink blush over a yellow background. The flesh is pale, smooth and very juicy, giving a soft, sweet eating experience. It is excellent as a dessert pear and also suitable for baking.",
        "img": "assets/pear-rosemarie.png",
        "glow": "#f29b4b",
        "specs": [
          ["Late Dec–Feb", "Harvest"],
          ["Sweet", "Taste"],
          ["Juicy/Smooth", "Texture"]
        ]
      },
      "vermont": {
        "name": "Vermont Beauty",
        "desc": "Green pear with pink-red speckles, refreshing crisp or soft.",
        "full": "Vermont Beauty is a bell-shaped green pear, easily recognised by its pink-red dots scattered across the skin. It can be enjoyed while still crisp and slightly coarse in texture or left to ripen until the flesh becomes fine, soft and melting. Flavour stays sweet and refreshing at both stages.",
        "img": "assets/pear-vermont.png",
        "glow": "#b8dd52",
        "specs": [
          ["Mar–May", "Harvest"],
          ["Sweet/Refreshing", "Taste"],
          ["Crisp → Soft", "Texture"]
        ]
      }
    },
    citrus: {
      "navel": {
        "name": "Navel Orange",
        "desc": "Sweet, seedless and easy-to-peel — famous for its signature belly-button.",
        "full": "Navel oranges are one of the world’s most popular sweet oranges, easily recognised by the small belly-button-like navel at one end. Naturally seedless and very easy to peel, they offer a bright sweet flavour with a gentle tang. Ideal for snacking, salads and fresh eating, they are enjoyed globally during their winter season.",
        "img": "assets/orange-navel.png",
        "glow": "#ff9b31",
        "specs": [
          ["Nov–May", "Harvest"],
          ["Sweet/Tangy", "Taste"],
          ["Seedless/Easy Peel", "Traits"]
        ]
      },
      "valencia": {
        "name": "Valencia Orange",
        "desc": "High-juice, bright and refreshing — the world’s favourite juicing orange.",
        "full": "Valencia oranges are prized for their exceptional juice content and refreshing sweet-acidic balance. With thin skin and only a few seeds, they are the leading choice for juice production worldwide. Their bright flavour and versatility make them perfect for fresh juice, marmalades, cooking and eating fresh.",
        "img": "assets/orange-valencia.png",
        "glow": "#ffa735",
        "specs": [
          ["Mar–Jul", "Harvest"],
          ["Sweet/Acidic", "Taste"],
          ["High Juice/Thin Skin", "Traits"]
        ]
      },
      "midknight": {
        "name": "Midknight Valencia",
        "desc": "Premium seedless Valencia type — extremely juicy and smooth.",
        "full": "Midknight Valencias are a South African premium strain of Valencia oranges, known for being virtually seedless, exceptionally juicy and smoother in texture compared to standard Valencias. They have thin skin, high juice recovery and a beautifully balanced flavour — making them a top-tier export and juicing favourite.",
        "img": "assets/orange-midknight.png",
        "glow": "#ffb03b",
        "specs": [
          ["Apr–Aug", "Harvest"],
          ["Sweet/Balanced", "Taste"],
          ["Seedless/High Juice", "Traits"]
        ]
      },
      "caracara": {
        "name": "Cara Cara",
        "desc": "Pink-fleshed, sweet and low-acid — a unique Navel mutation.",
        "full": "Cara Cara oranges are a natural mutation of the Navel orange, recognised by their beautiful rosy-pink flesh. They are seedless, low in acid, and exceptionally sweet, offering subtle berry-like notes. Loved for their colour and flavour, they are ideal for salads, fresh eating and premium juices.",
        "img": "assets/orange-caracara.png",
        "glow": "#ff8863",
        "specs": [
          ["Jun–Aug", "Harvest"],
          ["Sweet/Low Acid", "Taste"],
          ["Pink Flesh/Seedless", "Traits"]
        ]
      },
      "bloodorange": {
        "name": "Blood Orange",
        "desc": "Deep red flesh with raspberry-like notes — bold and dramatic.",
        "full": "Blood oranges are known for their striking red flesh, caused by natural anthocyanins. Their flavour is uniquely complex — sweet citrus with raspberry-like tones. They vary from lightly blushed to fully crimson inside. Perfect for juices, cocktails, pastries and fresh eating where visual impact is desired.",
        "img": "assets/orange-blood.png",
        "glow": "#c8393d",
        "specs": [
          ["Jun–Sep", "Harvest"],
          ["Sweet/Berry-like", "Taste"],
          ["Red Flesh/Aromatic", "Traits"]
        ]
      },
      "clementine": {
        "name": "Clementine",
        "desc": "Small, seedless, sweet mandarin — easy to peel and loved by all.",
        "full": "Clementines are smooth-skinned, small mandarins known for their rich sweetness, ease of peeling and typically seedless nature. Their tender segments and bright aroma make them a global favourite for children and adults alike. They are perfect for snacking and fresh consumption.",
        "img": "assets/mandarin-clementine.png",
        "glow": "#ff8f2d",
        "specs": [
          ["Apr–Aug", "Harvest"],
          ["Sweet/Aromatic", "Taste"],
          ["Seedless/Easy Peel", "Traits"]
        ]
      },
      "tangerine": {
        "name": "Tangerine",
        "desc": "Bright, tangy mandarin with bold aroma and soft peel.",
        "full": "Tangerines are vibrant mandarins with a deep orange peel, soft texture and a bold, tangy-sweet flavour. Their segments are tender and aromatic, making them beloved for both fresh eating and juicing. Slightly more acidic than clementines, they offer a refreshing citrus bite.",
        "img": "assets/mandarin-tangerine.png",
        "glow": "#ff7a20",
        "specs": [
          ["Apr–Jul", "Harvest"],
          ["Tangy/Sweet", "Taste"],
          ["Soft Peel/Aromatic", "Traits"]
        ]
      }
    },
    // Inline fallback data for stone fruits.  Without this, the stone
    // fruit page (peaches) will not work when fetch() is blocked (e.g.
    // when viewing the site locally as file://).  These entries mirror
    // stonefruits.json so the page remains fully interactive offline.
    stone: {
      "kakamas": {
        "name": "Kakamas Peach",
        "desc": "Firm yellow skin, classic canning variety.",
        "full": "Kakamas is a popular South African canning peach. It has a yellow skin and very firm yellow flesh, making it ideal for processing and long storage. Known for reliability and consistency.",
        "img": "assets/peach-kakamas.png",
        "glow": "#f2b705",
        "specs": [
          ["Dec–Jan", "Harvest"],
          ["Mild/Sweet", "Taste"],
          ["Very Firm", "Texture"]
        ]
      },
      "earligrande": {
        "name": "Earligrande",
        "desc": "Early oval peach with bright red blush.",
        "full": "Earligrande is an early-season peach with an oval shape and pointed end. It features yellow skin with up to 75% red coverage and a pleasant flavour with a coarse texture.",
        "img": "assets/peach-earligrande.png",
        "glow": "#ff6b3d",
        "specs": [
          ["Nov", "Harvest"],
          ["Sweet", "Taste"],
          ["Coarse", "Texture"]
        ]
      },
      "transvalia": {
        "name": "Transvalia",
        "desc": "Red blush on golden-yellow skin.",
        "full": "Transvalia peaches have a bold red blush over a yellow background. The flesh ranges from yellow to orange and offers a good taste with a fine texture.",
        "img": "assets/peach-transvalia.png",
        "glow": "#ff3b2f",
        "specs": [
          ["Dec", "Harvest"],
          ["Sweet", "Taste"],
          ["Fine", "Texture"]
        ]
      },
      "bonnigold": {
        "name": "Bonnigold",
        "desc": "Round yellow peach with non-melting flesh.",
        "full": "Bonnigold peaches are round with yellow skin and flesh. They are known for their non-melting texture and fair taste, mainly used in processing and canning.",
        "img": "assets/peach-bonnigold.png",
        "glow": "#ffbf00",
        "specs": [
          ["Dec–Jan", "Harvest"],
          ["Mild", "Taste"],
          ["Non-melting", "Texture"]
        ]
      },
      "summersun": {
        "name": "Summersun",
        "desc": "Light yellow peach with no red blush.",
        "full": "Summersun peaches have a light yellow skin with no red colouring. The flesh is also light yellow and offers a smooth, gentle sweetness.",
        "img": "assets/peach-summersun.png",
        "glow": "#fff1a8",
        "specs": [
          ["Jan", "Harvest"],
          ["Light Sweet", "Taste"],
          ["Soft/Smooth", "Texture"]
        ]
      },
      "excellence": {
        "name": "Excellence",
        "desc": "Yellow skin with deep red blush.",
        "full": "Excellence peaches show a strong red blush on golden skin. The yellow flesh is sweet and juicy with good eating quality.",
        "img": "assets/peach-excellence.png",
        "glow": "#ff4d4d",
        "specs": [
          ["Jan–Feb", "Harvest"],
          ["Sweet", "Taste"],
          ["Juicy", "Texture"]
        ]
      },
      "keisie": {
        "name": "Keisie",
        "desc": "Firm yellow peach ideal for canning.",
        "full": "Keisie peaches have yellow skin and firm yellow flesh. They are well suited for canning operations due to their strong structure and consistent shape.",
        "img": "assets/peach-keisie.png",
        "glow": "#f5b041",
        "specs": [
          ["Jan–Feb", "Harvest"],
          ["Mild Sweet", "Taste"],
          ["Very Firm", "Texture"]
        ]
      }
    }
  };

  // Helper: which fruit id is currently "active" in the right menu?
  function currentId() {
    if (!menu) return null;
    var active = menu.querySelector("a.active");
    if (active && fruits[active.dataset.id]) {
      return active.dataset.id;
    }
    var keys = Object.keys(fruits);
    return keys.length ? keys[0] : null;
  }

  // Helper: update the whole view when we switch fruit
  function setView(data) {
    if (!data || !nameEl || !descEl || !imgEl || !glowEl || !specsEl) return;

    // Title + short description
    nameEl.textContent = data.name;
    descEl.textContent = data.desc;

    // Image fade / slide animation
    imgEl.classList.remove("slide-in");
    imgEl.style.opacity = 0;

    window.setTimeout(function () {
      imgEl.loading = "lazy";
      imgEl.decoding = "async";
      imgEl.src = data.img;
      imgEl.alt =
        data.name + (fruitKind === "pear" ? " Lamp" : " Umbrella");
      imgEl.style.opacity = 1;
      imgEl.classList.add("slide-in");
    }, 220);

    // Glow background
    glowEl.style.background = data.glow || "white";

    // Update CSS accent colour on the root element.  Many elements in
    // style.css reference --accent for hover/active states.  By
    // overriding it here we can dynamically change the UI colour to
    // match the current fruit's highlight colour.  Fallback to a red
    // tone if no glow is provided.
    var accent = data.glow || "#ff3b3b";
    try {
      document.documentElement.style.setProperty("--accent", accent);
    } catch (e) {
      // ignore if running in an environment without documentElement
    }

    // Specs (harvest, taste, texture/crunch)
    if (Array.isArray(data.specs)) {
      specsEl.innerHTML = data.specs
        .map(function (s) {
          return (
            '<div class="spec"><div class="big">' +
            s[0] +
            '</div><div class="label">' +
            s[1] +
            "</div></div>"
          );
        })
        .join("");
    }
  }

  // Attach click events once we have data
  function attachListeners() {
    // Right-hand variety buttons
    if (menu) {
      var links = menu.querySelectorAll("a");
      links.forEach(function (a) {
        a.addEventListener("click", function (e) {
          e.preventDefault();
          var id = a.dataset.id;
          var data = fruits[id];
          if (!data) return;

          links.forEach(function (x) {
            x.classList.remove("active");
          });
          a.classList.add("active");
          setView(data);
        });
      });
    }

    // Learn more dialog
    if (learnBtn && dlg && dlgTitle && dlgSub && dlgBody) {
      learnBtn.addEventListener("click", function () {
        var id = currentId();
        var data = fruits[id];
        if (!data) return;

        dlgTitle.textContent = data.name;
        if (Array.isArray(data.specs) && data.specs.length) {
          dlgSub.textContent = "Harvest: " + data.specs[0][0];
        } else {
          dlgSub.textContent = "";
        }
        dlgBody.textContent = data.full || "";

        if (typeof dlg.showModal === "function") {
          dlg.showModal();
        }
      });
    }
  }

  // Load apples.json or pears.json
  function init() {
    fetch(jsonFile, { cache: "no-store" })
      .then(function (res) {
        if (!res.ok) throw new Error("HTTP " + res.status);
        return res.json();
      })
      .then(function (json) {
        fruits = json || {};
        attachListeners();
        var id = currentId();
        if (id && fruits[id]) {
          setView(fruits[id]);
        }
      })
      .catch(function (err) {
        // Failed to fetch the JSON; fall back to inline data.
        console.warn("Could not load " + jsonFile + ", falling back to inline data.", err);
        fruits = localData[fruitKind] || {};
        attachListeners();
        var id = currentId();
        if (id && fruits[id]) {
          setView(fruits[id]);
        }
      });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
