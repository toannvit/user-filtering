const moment = require("moment");
const { userRepo } = require("../models/repositories");

exports.getUsers = (req) => {
  const pipelines = [];
  const query = {};

  if (req.query["filter-type"]) {
    const filterType = ["week", "year", "month"].includes(
      req.query["filter-type"]
    )
      ? req.query["filter-type"]
      : "year";
    const filterDate = moment().utc();

    let addField = {};
    switch (filterType) {
      case "week":
        addField = {
          week: { $week: "$updatedAt" },
        };
        query["week"] = filterDate.week();
        break;

      case "month":
        addField = {
          month: { $month: "$updatedAt" },
        };
        query["month"] = filterDate.month();
        break;

      case "year":
        addField = {
          year: { $year: "$updatedAt" },
        };
        query["year"] = filterDate.year();
        break;
    }

    pipelines.push({
      $addFields: addField,
    });
  }

  if (req.query["filter-name"]) {
    query["fullName"] = {
      $regex: req.query["filter-name"],
      $options: "is",
    };
  }

  if (req.query["filter-date"]) {
    pipelines.push({
      $addFields: {
        updatedAt: {
          $dateToString: {
            format: "%Y/%m/%d",
            date: "$updatedAt",
          },
        },
      },
    });

    query["updatedAt"] = moment(req.query["filter-date"], "DD-MM-YYYY").format(
      "YYYY/MM/DD"
    );
  }

  if (req.query["filter-reference"]) {
    query["reference"] = req.query["filter-reference"];
  }

  if (req.query["filter-status"]) {
    query["status"] = req.query["filter-status"];
  }

  if (req.query["filter-dob"]) {
    query["dob"] = moment(req.query["filter-dob"], "DD-MM-YYYY").format(
      "YYYY/MM/DD"
    );
  }

  pipelines.push({
    $match: query,
  });

  const sortField = req.query["sort-by"] || "fullName";

  pipelines.push({
    $sort: {
      [sortField]: 1,
    },
  });

  return userRepo.aggregate(pipelines);
};
