// Pure helper functions, kept separate from script.js so they can be
// tested independently (see test.html).

function pluralize(count, singular, plural) {
    return count === 1 ? singular : plural;
}
