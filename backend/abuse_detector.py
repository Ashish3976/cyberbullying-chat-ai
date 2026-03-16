abusive_words = [

"idiot",
"stupid",
"dumb",
"loser",
"moron",

"yedava",
"vedhava",
"lanja",

"bewakoof",
"pagal",
"chutiya"

]

def detect_abuse(text):

    text = text.lower()

    for word in abusive_words:
        if word in text:
            return True

    return False