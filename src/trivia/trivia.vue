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
        <button @click="screenName = 'fill_details'" class="trivia__start">START</button>
      </div>
      <div class="d--fl ai--c fd--c" v-if="screenName === 'fill_details'">
        <div class="trivia__title trivia__name">What is your name?</div>
        <input class="trivia__textbox trivia_name-box" type="text" v-model="name" />
        <button @click="startQuiz" class="trivia__start">GO</button>
      </div>
      <div class="d--fl ai--c fd--c" v-if="screenName === 'score'">
        <img class="trivia_name-box trivia__score-img" src="./_images/score.gif" />
        <div class="trivia__level">Hey {{ name }}! Your score is {{ score }}</div>
      </div>
      <div v-if="screenName !== 'quiz'" class="trivia__man-spacing"><img class="trivia_quiz-man" src="./_images/Man.png" /></div>
    </div>
    <div
      v-if="screenName === 'quiz'"
      class="d--fl ai--c fd--c trivia__question" :class="rotateQuestion">
      <div class="trivia__level">Time left: {{ countDown }}</div>
      <div class="trivia__level">Level 1</div>
      <img class="trivia__question-box" alt="question_box" src="./_images/Question-Box.png" />
      <span class="trivia__question-name">{{ questionList.questions[questionNumber].question }}</span>
      <div class="d--fl jc--sb trivia__options">
        <input @click="optionClick($event, questionList.questions[questionNumber].answer)" type="text" class="trivia__textbox"
               :value="questionList.questions[questionNumber].options[0].option1" readonly />
        <input @click="optionClick($event, questionList.questions[questionNumber].answer)" type="text" class="trivia__textbox"
               :value="questionList.questions[questionNumber].options[0].option2" readonly />
      </div>
      <div
        v-if="questionList.questions[questionNumber].options[0].option3 && questionList.questions[questionNumber].options[0].option4"
        class="d--fl jc--sb trivia__options top-spacing">
        <input @click="optionClick($event, questionList.questions[questionNumber].answer)" type="text" class="trivia__textbox"
               :value="questionList.questions[questionNumber].options[0].option3" readonly />
        <input @click="optionClick($event, questionList.questions[questionNumber].answer)" type="text" class="trivia__textbox"
               :value="questionList.questions[questionNumber].options[0].option4" readonly />
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'Trivia',
  data () {
    return {
      questionNumber: 0,
      rotateQuestion: '',
      screenName: 'welcome',
      countDown : 10,
      questions: {},
      score: 0,
      name: ''
    };
  },
  computed: {
    questionList () {
      return {
        level: 'level1',
        type: 'multi',
        questions: [
          {
            question: 'An offer be cancelled by both seller and buyer?',
            type: 'multi',
            options: [{
              option1: true,
              option2: false
            }],
            answer: false
          },
          {
            question: 'Can I create stories in iPad?',
            type: 'multi',
            options: [{
              option1: true,
              option2: false
            }],
            answer: false
          },
          {
            question: 'Can we save 10 drafts in create listing?',
            type: 'multi',
            options: [{
              option1: true,
              option2: false
            }],
            answer: false
          },
          {
            question: 'Poshmark was launched on 2011?',
            type: 'multi',
            options: [{
              option1: true,
              option2: false
            }],
            answer: true
          },
          {
            question: 'First PoshFest was held in Las Vegas?',
            type: 'multi',
            options: [{
              option1: true,
              option2: false
            }],
            answer: true
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
        this.countDown = 10;

        if (event)
          event.target.style.background = 'none';
        this.rotateQuestion = 'resetRotateQuestion';
      }
    },
    optionClick (event, answer) {
      if (event.target.value === String(answer)) {
        this.score++;
      }
      event.target.style.background = '#00c818';

      if (this.questionNumber < this.questionCount - 1) {
        this.countDown = 10;
        this.rotateQuestion = 'rotateQuestion';
      } else {
        this.screenName = 'score';
      }

      setTimeout(() => {
        this.moveNext(event);
      }, 1000);
    },
    startQuiz () {
      this.screenName = 'quiz';
      this.countDownTimer();
    },
    countDownTimer() {
      if(this.countDown > 0) {
        setTimeout(() => {
          this.countDown -= 1;
          this.countDownTimer();
        }, 1000)
      } else {
        this.moveNext();
        this.countDownTimer();
      }
    },
    async readQuestions () {
      const response = await axios.get(`http://jsonplaceholder.typicode.com/posts`);
      if (response && response.data) {
       this.questions = response.data;
      }
    }
  },
  mounted () {
    setTimeout(() => { this.screenName = 'start'; }, 2000);
  }
};
</script>