function TemplateList(result) {
    const templateDetails = result.get();
    const stripHtml = require("string-strip-html");

    return {
        id: templateDetails.id,
        name: templateDetails.name,
        content: templateDetails.content
            ? stripHtml(templateDetails.content)
            : "",
        htmlContent: templateDetails.content ? templateDetails.content : "",
    };
}

module.exports = TemplateList;
