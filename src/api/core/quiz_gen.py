import random
import spacy


class QuizItem:
    def __init__(self, item: str, answer: str) -> None:
        self.item = item.strip()
        self.answer = answer.strip()

    
    def __str__(self):
        return f"{self.item} - {self.answer}"
    

    def to_json(self):
        return {
            "item": self.item,
            "answer": self.answer,
        }


NLP = spacy.load("en_core_web_sm")


class TextProcessor:
    def __init__(self, text) -> None:
        self._doc = NLP(text)

        self.__merge_noun_phrases()
        self.__merge_entity_phrases()


    # Merge noun phrases into a single token
    def __merge_noun_phrases(self):
        with self._doc.retokenize() as retokenizer:
            for noun_phrase in self._doc.noun_chunks:
                retokenizer.merge(noun_phrase)


    # Merge entity phrases into a single token
    def __merge_entity_phrases(self):
        with self._doc.retokenize() as retokenizer:
            for entity in self._doc.ents:
                retokenizer.merge(entity)


    # Merge punctuations into a single token
    def __merge_punctuations(self, exceptions=[]):
        spans = []
        for word in self._doc[:-1]:
            if word.is_punct or not word.nbor(1).is_punct:
                continue
            start = word.i
            end = word.i + 1
            while end < len(self._doc) and self._doc[end].is_punct:
                end += 1
            span = self._doc[start:end]
            spans.append((span, word.tag_, word.lemma_, word.ent_type_))

        with self._doc.retokenize() as retokenizer:
            for span, tag, lemma, ent_type in spans:
                attrs = {"tag": tag, "lemma": lemma, "ent_type": ent_type}
                retokenizer.merge(span, attrs=attrs)


class Extractor:
    def extract():
        pass


class SubjectExtractor(Extractor):
    def extract(self, sentence, include_stop_words=False):
        if include_stop_words:
            for token in sentence:
                if "subj" in token.dep_:
                    return token
        else:     
            for token in sentence:
                if "subj" in token.dep_ and not token.is_stop:
                    return token
        
        return None
        

class ObjectExtractor(Extractor):
    def extract(self, sentence, include_stop_words=False):
        if include_stop_words:
            for token in sentence:
                if "obj" in token.dep_:
                    return token
        else:
            for token in sentence:
                if "obj" in token.dep_ and not token.is_stop:
                    return token
                
        return None


class QuestionGenerator(TextProcessor):
    def generate_question(self):
        pass
                

class FillInTheBlanksQuestion(QuestionGenerator):
    def __init__(self, text) -> None:
        super().__init__(text)

        self.subject_extractor = SubjectExtractor()
        self.object_extractor = ObjectExtractor()


    def generate_question(self):
        items = []
        for sentence in self._doc.sents:
            extractor = random.choice([self.subject_extractor, self.object_extractor])
            answer = extractor.extract(sentence)

            if answer is None:
                continue

            new_sentence = ""
            for token in sentence:
                if token == answer:
                    new_sentence += "__________" + token.whitespace_
                else:
                    new_sentence += token.text_with_ws

            items.append(QuizItem(new_sentence, answer.text))

        return items


class MatchingTypeQuestion(QuestionGenerator):
    def __init__(self, texts) -> None:
        self.texts = texts


    def generate_question(self):
        questions = []
        choices = []

        for text in self.texts:
            generator = FillInTheBlanksQuestion(text)
            items = generator.generate_question()  

            questions += items
            choices += [item.answer for item in items]

        random.shuffle(choices)

        return {
            "questions": questions,
            "choices": choices,
        }
