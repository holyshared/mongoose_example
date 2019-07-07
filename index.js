const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({ name: String });
const Category = mongoose.model('Category', categorySchema);

const reportSchema = new mongoose.Schema({
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category'
  },
  year: Number,
  month: Number,
  value: Number
});

const Report = mongoose.model('Report', reportSchema);

const reportStatsSchema = new mongoose.Schema(
  {
    _id: {
      year: Number,
      month: Number
    },
    value: Number
  },
  {
    _id: false,
    collection: 'report_stats',
    toJSON: {
      transform: function (doc, ret, options) {
        ret.slug = `${doc._id.year}-${doc._id.month}`;
        return ret;
      }
    }
  });
const ReportStats = mongoose.model('ReportStats', reportStatsSchema);

//
mongoose.connect("mongodb://example:example@localhost:27017/example", { useNewUrlParser: true });

const mapReduce = async () => {
  const cat = await Category.create({ name: 'A' });

  await Report.create([
    { category: cat, year: 2019, month: 1, value: 1 },
    { category: cat, year: 2019, month: 2, value: 1 },
    { category: cat, year: 2019, month: 3, value: 1 },
  ]);

  await Report.mapReduce({
    scope: {
      query: { year: 2019 }
    },
    query: { year: 2019 },
    map: function() {
      emit({ category: this.category, year: this.year, month: this.month }, 1);
    },
    reduce: function(key, values) {
      return values.length;
    },
    out: {
      replace: 'report_stats'
    }
  });

  const query = { category: cat._id, year: 2019, month: 1 };
  const report = await ReportStats.findById(query);
  console.log('report----------');
  console.log(report);
  console.log(report.toJSON());

};

mapReduce().then(() => {
  console.log('done');
});
