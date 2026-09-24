import { useEffect, useState } from 'react';
import './App.css';
import recipioData from './data/recipio.json';
import logo from '../public/logo.png'

const ALL_MEALS = recipioData.recipio.flat();

const CATEGORIES = [
  'Quyuq Taomlar',
  'Suyuq Taomlar',
  'Xamirli Taomlar',
  'Salatlar',
  'Pishiriqlar',
  'Ichimliklar',
];

const UZBEK_IMAGES = [
  'uzbek plov food dish',
  'uzbek samsa food dish',
  'manti dumplings food plate',
  'lagman noodle food dish',
  'uzbek non bread food',
  'uzbek rice food dish',
  'uzbek dessert food',
  'traditional uzbek food table',
];

const EXCLUDE_WORDS = [
  'man',
  'woman',
  'people',
  'person',
  'chef',
  'cook',
  'hand',
  'market',
  'seller',
  'child',
  'kid',
  'boy',
  'girl',
  'worker',
  'vendor',
  'crowd',
  'street',
  'shop',
  'store',
];

function App() {
  const [search, setSearch] = useState('');
  const [heroImages, setHeroImages] = useState([]);
  const [heroIndex, setHeroIndex] = useState(0);
  const [activeCategory, setActiveCategory] = useState('hammasi');
  const [selectedMeal, setSelectedMeal] = useState(null);

  if (clean.length > 0) {
    const shuffled = [...clean].sort(() => Math.random() - 0.5);
    setHeroImages(shuffled.slice(0, 5).map((photo) => photo.src.large));
  }

  useEffect(() => {
    if (heroImages.length < 2) return;

    const id = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % heroImages.length);
    }, 3500);

    return () => clearInterval(id);
  }, [heroImages]);

  const filteredMeals = ALL_MEALS.filter((meal) => {
    const categoryMatch =
      activeCategory === 'hammasi' ||
      meal.category === activeCategory;

    const searchText = search.toLowerCase().trim();

    const nameMatch = meal.name
      .toLowerCase()
      .includes(searchText);

    const ingredientMatch = meal.ingredients?.some((ingredient) =>
      ingredient.toLowerCase().includes(searchText)
    );

    return categoryMatch && (nameMatch || ingredientMatch);
  });


  useEffect(() => {
    const getHeroImage = async () => {
      try {
        const randomQuery =
          UZBEK_IMAGES[
          Math.floor(Math.random() * UZBEK_IMAGES.length)
          ];

        const response = await fetch(
          `https://api.pexels.com/v1/search?query=${encodeURIComponent(
            randomQuery
          )}&per_page=30&orientation=landscape`,
          {
            headers: {
              Authorization: import.meta.env.VITE_PEXELS_API_KEY,
            },
          }
        );

        const data = await response.json();

        if (data.photos && data.photos.length > 0) {
          const clean = data.photos.filter((photo) => {
            const alt = (photo.alt || '').toLowerCase();
            const photographer = (
              photo.photographer || ''
            ).toLowerCase();

            const text = `${alt} ${photographer}`;

            const excluded = EXCLUDE_WORDS.some((word) =>
              text.includes(word)
            );

            const ratio = photo.width / photo.height;

            return (
              !excluded &&
              ratio > 1.2 &&
              ratio < 2 &&
              photo.src?.large
            );
          });

          if (clean.length > 0) {
            const random =
              clean[Math.floor(Math.random() * clean.length)];

            setHeroImage(random.src.large);
          }
        }
      } catch (error) {
        console.log('Rasm yuklashda xatolik:', error);
      }
    };

    getHeroImage();
  }, []);

  const clearSearch = () => {
    setSearch('');
  };

  useEffect(() => {
    if (selectedMeal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [selectedMeal]);

  return (
    <section className="section1">


      <header className="header">
        <img width={150} src={logo} alt="" />
      </header>

      <main className="main">

        <div className="main-div">

          <h1 className="hero-h1">
            Uyda bor masalliqlardan,{' '}
            <span className="accent">mazzali</span> taom yarating.
          </h1>

          <p>
            Ingredient yoki taom nomini yozing — bizning katalogdan
            mos retseptlarni, to‘liq tarkib va tayyorlash bosqichlari
            bilan topamiz.
          </p>

          <div className="input-div">

            <input
              placeholder="masalan: go‘sht, tovuq, guruch"
              type="text"
              className="input"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <button className="main-btn">
              Qidirish
            </button>

          </div>

        </div>


        <div className="hero-div">
          {heroImages.length > 0 && (
            <div className="hero-visual">
              {heroImages.map((src, i) => (
                <img
                  key={src}
                  className={`hero-img ${i === heroIndex ? 'active' : ''}`}
                  src={src}
                  alt="O‘zbek taomi"
                />
              ))}

              <div className="tag">O‘zbek taomlari</div>
            </div>
          )}
        </div>

      </main>


      <section className="section2">


        <div className="category-btn">

          <button
            className={`chip ${activeCategory === 'hammasi'
              ? 'active'
              : ''
              }`}
            onClick={() => setActiveCategory('hammasi')}
          >
            Hammasi
          </button>


          {CATEGORIES.map((cat) => (

            <button
              key={cat}
              className={`chip ${activeCategory === cat
                ? 'active'
                : ''
                }`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>

          ))}

        </div>

        {filteredMeals.length > 0 ? (

          <div className="meals-grid">

            {filteredMeals.map((meal) => (

              <div
                className="meal-card"
                key={`${meal.category}-${meal.id}`}
                onClick={() => setSelectedMeal(meal)}
              >

                <img
                  src={meal.image}
                  alt={meal.name}
                />

                <div className="meal-card-body">

                  <div className="meal-category">
                    {meal.category}
                  </div>

                  <h3>
                    {meal.name}
                  </h3>

                </div>

              </div>

            ))}

          </div>

        ) : (


          <div className="empty-result">

            <div className="empty-icon">
              🔎
            </div>

            <h2>
              Retsept topilmadi
            </h2>

            <p>
              {search.trim() ? (
                <>
                  <strong>"{search}"</strong> bo‘yicha
                  Recipio’da hech qanday retsept topilmadi.
                </>
              ) : (
                <>
                  Bu kategoriyada hozircha retseptlar mavjud emas.
                </>
              )}
            </p>

            <span>
              Boshqa taom yoki masalliq nomini sinab ko‘ring.
            </span>

            {search.trim() && (
              <button
                className="clear-search-btn"
                onClick={clearSearch}
              >
                Qidiruvni tozalash
              </button>
            )}

          </div>

        )}


      </section>


      {/* ================================
          RECIPE DETAIL MODAL
      ================================= */}

      {selectedMeal && (

        <div
          className="detail-overlay"
          onClick={() => setSelectedMeal(null)}
        >

          <div
            className="detail"
            onClick={(e) => e.stopPropagation()}
          >

            {/* MODAL HEADER */}

            <div className="detail-head">

              <div>

                <h2>
                  {selectedMeal.name}
                </h2>

                <div className="meta">
                  {selectedMeal.category}
                </div>

              </div>


              <button
                className="close-btn"
                onClick={() => setSelectedMeal(null)}
              >
                ×
              </button>

            </div>


            {/* MODAL CONTENT */}

            <div className="detail-grid">

              <img
                src={selectedMeal.image}
                alt={selectedMeal.name}
              />


              <div>

                {/* INGREDIENTS */}

                <div className="ing-title">
                  Tarkibi
                </div>

                <ul className="ing-list">

                  {selectedMeal.ingredients?.map(
                    (ing, i) => (

                      <li key={i}>
                        {ing}
                      </li>

                    )
                  )}

                </ul>


                {/* INSTRUCTIONS */}

                <div className="instr-title">
                  Tayyorlash
                </div>

                <p className="instr">
                  {selectedMeal.instructions}
                </p>

              </div>

            </div>

          </div>

        </div>

      )}

    </section>
  );
}

export default App;