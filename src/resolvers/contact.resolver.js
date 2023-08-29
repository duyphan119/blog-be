const Contact = require("../models/contact.model");

const createContact = async (parent, args, context) => {
  try {
    const { createContactInput } = args;
    const createdContact = new Contact(createContactInput);
    const savedContact = await createdContact.save();
    return savedContact;
  } catch (error) {
    throw error;
  }
};

const contacts = async (parent, args, context) => {
  try {
    const { contactsInput } = args;

    const { limit, p, sortBy, sortType, keyword } = contactsInput;
    const where = {
      ...(keyword
        ? {
            $or: [
              { firstName: new RegExp(keyword, "i") },
              { lastName: new RegExp(keyword, "i") },
              { email: new RegExp(keyword, "i") },
              { phone: new RegExp(keyword, "i") },
              { message: new RegExp(keyword, "i") },
            ],
          }
        : {}),
    };
    let query = Contact.find(where).sort({
      [sortBy || "createdAt"]: sortType === "asc" ? "asc" : "desc",
    });
    if (limit) {
      if (p) {
        query = query.skip(limit * (p - 1));
      }
      query = query.limit(limit);
    }

    const contacts = await query;

    const count = await Contact.count(where);

    const totalPages = limit ? Math.ceil(count / limit) : 1;

    return {
      contacts,
      count,
      totalPages,
    };
  } catch (error) {
    throw error;
  }
};

const contactResolver = { Query: { contacts }, Mutation: { createContact } };

module.exports = contactResolver;
