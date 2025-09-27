const mongoose = require("mongoose");
const cities = require("./cities");
const { descriptors, places } = require("./seedHelpers");
const Campground = require("../models/campground");

mongoose
  .connect("mongodb://127.0.0.1:27017/yelp-camp", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => {
    console.log("MongoDBコネクションオッケー");
  })
  .catch((err) => {
    console.log("MongoDBコネクションエラー");
    console.log(err);
  });

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
  await Campground.deleteMany({});
  for (let i = 0; i < 50; i++) {
    const randomCityIndex = Math.floor(Math.random() * cities.length);
    const price = Math.floor(Math.random() * 2000) + 1000;
    const camp = new Campground({
      author: '68bfc46f9db36371f4aabc92',
      location: `${cities[randomCityIndex].prefecture}${cities[randomCityIndex].city}`,
      title: `${sample(descriptors)}・${sample(places)}`,
      description: '親譲りの無鉄砲で小供の時から損ばかりしている。小学校に居る時分学校の二階から飛び降りて一週間ほど腰を抜かした事がある。なぜそんな無闇をしたと聞く人があるかも知れぬ。別段深い理由でもない。新築の二階から首を出していたら、同級生の一人が冗談に、いくら威張っても、そこから飛び降りる事は出来まい。弱虫やーい。と囃したからである。小使に負ぶさって帰って来た時、おやじが大きな眼をして二階ぐらいから飛び降りて腰',
      geometry: {
        type: 'Point',
        coordinates:[
          cities[randomCityIndex].longitude,
          cities[randomCityIndex].latitude
          
        ]
      },
      price,
      images:[
    {
      url: 'https://res.cloudinary.com/do6jgqbfh/image/upload/v1757882631/YelpCamp/hgak6gcwdeo6os8zulzo.png',
      filename: 'YelpCamp/hgak6gcwdeo6os8zulzo'
    },
    {
      url: 'https://res.cloudinary.com/do6jgqbfh/image/upload/v1757882632/YelpCamp/a8hbhiropnfpubpoczyl.png',
      filename: 'YelpCamp/a8hbhiropnfpubpoczyl'
    },
    {
      url: 'https://res.cloudinary.com/do6jgqbfh/image/upload/v1757882632/YelpCamp/qgdnw7avhzm1rqhpvth1.png',
      filename: 'YelpCamp/qgdnw7avhzm1rqhpvth1'
    }
  ],

    });
    await camp.save();
  }
};

seedDB().then(() => {
  mongoose.connection.close();
});
