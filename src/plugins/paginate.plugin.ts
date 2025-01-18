export interface IPaginateOptions {
  limit?: number;
  page?: number;
  populate?: string;
  sortBy?: string;
}

interface Populate {
  path: string;
  populate: Populate | string | undefined;
}

// [options.sortBy] - Sorting criteria using the format: sortField:(desc|asc). Multiple sorting criteria should be separated by commas (,)
// [options.populate] - Populate data fields. Hierarchy of fields should be separated by (.). Multiple populating criteria should be separated by commas (,)
// [options.limit] - Maximum number of results per page (default = 10)
// [options.page] - Current page (default = 1)
export const paginate = (schema: any) => {
  schema.statics.paginate = async function (
    filter: any,
    options: IPaginateOptions
  ) {
    let sort = "";
    if (options.sortBy) {
      const sortingCriteria: string[] = [];
      options.sortBy.split(",").forEach((sortOption) => {
        const [key, order] = sortOption.split(":");
        sortingCriteria.push((order === "desc" ? "-" : "") + key);
      });
      sort = sortingCriteria.join(" ");
    } else {
      sort = "createdAt";
    }

    const limit = options.limit && options.limit > 0 ? options.limit : 10;
    const page = options.page && options.page > 0 ? options.page : 1;
    const skip = (page - 1) * limit;

    for (const key in filter) {
      if (filter[key] === undefined) {
        delete filter[key];
      }
    }

    const countPromise = this.countDocuments(filter).exec();
    let docsPromise = this.find(filter).sort(sort).skip(skip).limit(limit);

    if (options.populate) {
      options.populate.split(",").forEach((populateOption) => {
        const arr = populateOption
          .split(".")
          .reverse()
          .reduce<Populate | undefined>(
            (a, b) => ({ path: b, populate: a }),
            undefined
          );

        docsPromise = docsPromise.populate(arr);
      });
    }

    docsPromise = docsPromise.exec();

    return Promise.all([countPromise, docsPromise]).then((values) => {
      const [totalResults, results] = values;
      const totalPages = Math.ceil(totalResults / limit);
      const result = {
        limit,
        page,
        results,
        totalPages,
        totalResults,
      };
      return Promise.resolve(result);
    });
  };
};
