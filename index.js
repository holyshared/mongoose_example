const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({ year: Number, month: Number, value: Number });
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
  await Report.create([
    { year: 2019, month: 1, value: 1 },
    { year: 2019, month: 2, value: 1 },
    { year: 2019, month: 3, value: 1 },
  ]);

  await Report.mapReduce({
    scope: {
      query: { year: 2019 }
    },
    query: { year: 2019 },
    map: function() {
      emit({ year: this.year, month: this.month }, 1);
    },
    reduce: function(key, values) {
      return values.length;
    },
    out: {
      replace: 'report_stats'
    }
  });

  const report = await ReportStats.findById({ year: 2019, month: 1 });
  console.log('report----------');
  console.log(report);
  console.log(report.toJSON());

};

mapReduce().then(() => {
  console.log('done');
});
