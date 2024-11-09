const flattenBody = (body) => body.replace(/\n/g, '').replace(/\t/g, ' ');

module.exports = { flattenBody };
