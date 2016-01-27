const helpMsg = `
Usage: node index [options]

    -n number, --job-number=number\tJob # in the selected job-type
    -j value, --job-type=value\tJob type defined in the CI
    -h, --help\t\tShows help

Example of use:\tnode index -n 1372 -j node-test-pull-request
`;

module.exports = {
    helpMsg: helpMsg
};
