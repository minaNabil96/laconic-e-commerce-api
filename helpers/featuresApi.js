class FeaturesApi {
  constructor(reqQuery, reqString, isVisible = true) {
    this.reqQuery = reqQuery;
    this.reqString = reqString;
    this.isVisible = isVisible;
  }

  filter() {
    // const { reqQuery, isVisible } = this;
    const queryObj = { ...this.reqString };
    queryObj.visible = this.isVisible;
    const exclude = ["limit", "page", "sort", "fields", "term"];
    exclude.forEach((field) => delete queryObj[field]);
    const queryString = JSON.stringify(queryObj);

    // const gg = /\b(gte|gt|lte|lt)\b/g;
    // console.log(queryString.match(gg));
    const queryStringCheck = queryString.includes(
      "$lt" || "$lte" || "$gt" || "$gte"
    );

    this.reqQuery = this.reqQuery.find(JSON.parse(queryString));
    return this;
  }

  sort() {
    if (this.reqString.sort) {
      const sortBy = this.reqString.sort.split(",").join(" ");
      this.reqQuery = this.reqQuery.sort(sortBy);
    } else {
      this.reqQuery = this.reqQuery.sort("-createdAt");
    }

    return this;
  }

  fields() {
    if (this.reqString.fields) {
      const limitFields = this.reqString.fields.split(",").join(" ");
      this.reqQuery = this.reqQuery.select(limitFields);
    } else {
      this.reqQuery = this.reqQuery.select("-__v");
    }
    return this;
  }

  search() {
    if (this.reqString.term) {
      const { term } = this.reqString;
      this.reqQuery = this.reqQuery.find({
        $or: [
          { name: { $regex: term, $options: "i" } },
          { desc: { $regex: term, $options: "i" } },
        ],
      });
    }
    return this;
  }

  paginate(documentCount) {
    const paginateObj = {};
    const page = Number(this.reqString.page) || 1;
    const limit = Number(this.reqString.limit) || 4;
    const skip = (page - 1) * limit;
    const currentPage = page;
    const numberOfPages = Math.ceil(documentCount / limit);
    const endIdx = limit * page;
    if (documentCount > endIdx) {
      paginateObj.nextPage = page + 1;
    }
    if (skip > 0) {
      paginateObj.previosPage = page - 1;
    }
    paginateObj.currentPage = currentPage;
    paginateObj.limitBy = limit;
    paginateObj.numOfAllPages = numberOfPages;
    paginateObj.numOfAllDocs = documentCount;
    // asign paginationObj to the returnd obj
    this.pagination = paginateObj;

    this.reqQuery = this.reqQuery.skip(skip).limit(limit);

    return this;
  }
}

module.exports = FeaturesApi;

// class FeaturesApi {
//   constructor(mongooseQuery, queryString) {
//     this.mongooseQuery = mongooseQuery;
//     this.queryString = queryString;
//   }

//   filter() {
//     const queryStringObj = { ...this.queryString };
//     const excludesFields = ["page", "sort", "limit", "fields"];
//     excludesFields.forEach((field) => delete queryStringObj[field]);
//     // Apply filtration using [gte, gt, lte, lt]
//     const queryStr = JSON.stringify(queryStringObj);
//     // queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

//     this.mongooseQuery = this.mongooseQuery.find(JSON.parse(queryStr));

//     return this;
//   }

//   sort() {
//     if (this.queryString.sort) {
//       const sortBy = this.queryString.sort.split(",").join(" ");
//       this.mongooseQuery = this.mongooseQuery.sort(sortBy);
//     } else {
//       this.mongooseQuery = this.mongooseQuery.sort("-createAt");
//     }
//     return this;
//   }

//   limitFields() {
//     if (this.queryString.fields) {
//       const fields = this.queryString.fields.split(",").join(" ");
//       this.mongooseQuery = this.mongooseQuery.select(fields);
//     } else {
//       this.mongooseQuery = this.mongooseQuery.select("-__v");
//     }
//     return this;
//   }

//   search(modelName) {
//     if (this.queryString.keyword) {
//       let query = {};
//       if (modelName === "Products") {
//         query.$or = [
//           { title: { $regex: this.queryString.keyword, $options: "i" } },
//           { description: { $regex: this.queryString.keyword, $options: "i" } },
//         ];
//       } else {
//         query = { name: { $regex: this.queryString.keyword, $options: "i" } };
//       }

//       this.mongooseQuery = this.mongooseQuery.find(query);
//     }
//     return this;
//   }

//   paginate(countDocuments) {
//     const page = this.queryString.page * 1 || 1;
//     const limit = this.queryString.limit * 1 || 50;
//     const skip = (page - 1) * limit;
//     const endIndex = page * limit;

//     // Pagination result
//     const pagination = {};
//     pagination.currentPage = page;
//     pagination.limit = limit;
//     pagination.numberOfPages = Math.ceil(countDocuments / limit);

//     // next page
//     if (endIndex < countDocuments) {
//       pagination.next = page + 1;
//     }
//     if (skip > 0) {
//       pagination.prev = page - 1;
//     }
//     this.mongooseQuery = this.mongooseQuery.skip(skip).limit(limit);

//     this.paginationResult = pagination;
//     return this;
//   }
// }

module.exports = FeaturesApi;
