<style lang="scss">
  @import './_styles/common.scss';
  @import './_styles/trivia.scss';
</style>

<template>
  <div
    class="container-fluid">
    <div class="d--fl ai--c fd--c">
      <div v-if="screenName === 'welcome'">
        <img class="trivia__pm-logo" src="./_images/PM-mark-white.png" />
      </div>
      <div class="d--fl ai--c fd--c" v-if="screenName === 'start'">
        <div class="trivia__title">POSH QUIZ</div>
        <button @click="startQuiz" class="trivia__start">START</button>
      </div>
      <div v-if="screenName !== 'quiz'" class="trivia__man-spacing"><img class="trivia_quiz-man" src="./_images/Man.png" /></div>
    </div>
    <div
      v-if="screenName === 'quiz'"
      class="d--fl ai--c fd--c trivia__question" :class="rotateQuestion">
      <div class="trivia__level">Level 1</div>
      <img class="trivia__question-box" alt="question_box" src="./_images/Question-Box.png" />
      <span class="trivia__question-name">{{ questionList.questions[questionNumber].question }}</span>
      <div class="d--fl jc--sb trivia__options">
        <input @click="optionClick" type="text" class="trivia__textbox" :value="questionList.questions[questionNumber].options[0].option1" readonly />
        <input @click="optionClick" type="text" class="trivia__textbox" :value="questionList.questions[questionNumber].options[0].option2" readonly />
      </div>
      <div
        v-if="questionList.questions[questionNumber].options[0].option3 && questionList.questions[questionNumber].options[0].option4"
        class="d--fl jc--sb trivia__options top-spacing">
        <input @click="optionClick" type="text" class="trivia__textbox" :value="questionList.questions[questionNumber].options[0].option3" readonly />
        <input @click="optionClick" type="text" class="trivia__textbox" :value="questionList.questions[questionNumber].options[0].option4" readonly />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Trivia',
  data () {
    return {
      questionNumber: 0,
      rotateQuestion: '',
      screenName: 'welcome'
    };
  },
  computed: {
    questionList () {
      return {
        type: 'multi',
        questions: [
          {
            question: 'some question 1?',
            type: 'multi',
            options: [{
              option1: 'someA',
              option2: 'someB',
              option3: 'someC',
              option4: 'someD'
            }]
          },
          {
            question: 'some question 2?',
            type: 'multi',
            options: [{
              option1: 'someAf',
              option2: 'someBC',
              option3: 'someCs',
              option4: 'someDd'
            }]
          },
          {
            question: 'some question 3?',
            type: 'multi',
            options: [{
              option1: 'someAf33',
              option2: 'someBC3',
              option3: 'someCs3',
              option4: 'someDd3'
            }]
          }
        ]
      }
    },
    questionCount () {
      return this.questionList.questions.length;
    }
  },
  methods: {
    moveNext (event) {
      if (this.questionNumber < this.questionCount - 1) {
        this.questionNumber++;
        if (event)
          event.target.style.background = 'none';
        this.rotateQuestion = 'resetRotateQuestion';
      } else {
        window.location.assign('/');
      }
    },
    optionClick (event) {
      event.target.style.background = '#00c818';

      if (this.questionNumber < this.questionCount - 1) {
        this.rotateQuestion = 'rotateQuestion';
      } else {
        alert("Score is 2");
        window.location.assign('/');
      }

      setTimeout(() => {
        this.moveNext(event);
      }, 1000);
    },
    startQuiz () {
      this.screenName = 'quiz';
    }
  },
  mounted () {
    setTimeout(() => { this.screenName = 'start'; }, 2000);
  }
};
</script>