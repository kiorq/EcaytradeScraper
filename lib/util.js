const asyncMap = async function(list, iter_func) {
    return await Promise.all(list.map(iter_func));
};

module.exports = {
    asyncMap
};
