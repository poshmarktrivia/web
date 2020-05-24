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
      <div v-if="screenName !== 'quiz' && screenName !== 'levelScreen'" class="trivia__man-spacing"><img class="trivia_quiz-man" src="./_images/Man.png" /></div>
    </div>
    <div
      v-if="screenName === 'quiz'"
      class="d--fl ai--c fd--c trivia__question" :class="rotateQuestion">
      <div class="trivia__level">Time left: {{ countDown }}</div>
      <div class="trivia__level">Level 1</div>
      <img class="trivia__question-box" alt="question_box" src="./_images/Question-Box.png" />
      <span class="trivia__question-name">{{ questionList.questions[questionNumber].question }}</span>
      <div class="d--fl jc--sb trivia__options">
        <input @click="optionClick($event, questionList.questions[questionNumber].answers[0])" type="text" class="trivia__textbox"
               :value="questionList.questions[questionNumber].options[0]" readonly />
        <input @click="optionClick($event, questionList.questions[questionNumber].answers[0])" type="text" class="trivia__textbox"
               :value="questionList.questions[questionNumber].options[1]" readonly />
      </div>
      <div
        v-if="questionList.questions[questionNumber].options[2] && questionList.questions[questionNumber].options[3]"
        class="d--fl jc--sb trivia__options top-spacing">
        <input @click="optionClick($event, questionList.questions[questionNumber].answers[0])" type="text" class="trivia__textbox"
               :value="questionList.questions[questionNumber].options[2]" readonly />
        <input @click="optionClick($event, questionList.questions[questionNumber].answers[0])" type="text" class="trivia__textbox"
               :value="questionList.questions[questionNumber].options[3]" readonly />
      </div>
    </div>
    <div
      class="d--fl ai--c fd--c trivia__level-con"
      v-else-if="screenName === 'levelScreen'">
      <img class="trivia__level-box" alt="question_box" src="./_images/Question-Box.png" />
      <div class="trivia__level-details">
        <p class="trivia__level-welcome">Welcome to level 2</p>
        <p class="trivia__level-rule">Rules are simple, guess all the words hidden in the cross word with the hints given.</p>
        <button @click="nextLevel" class="trivia__start">GO</button>
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
      countDown : 0,
      questions: {},
      score: 0,
      name: '',
      questionList: {},
      level: 1
    };
  },
  computed: {
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
      event.target.style.background = 'lightblue';

      if (this.questionNumber < this.questionCount - 1) {
        this.countDown = 10;
        this.rotateQuestion = 'rotateQuestion';
      } else {
        if (this.level === 2) {
          axios.put('http://poshmark-trivia-server.herokuapp.com/api/score', {
            name: this.name,
            score: this.score
          });
          this.screenName = 'score';
        } else {
          this.screenName = 'levelScreen';
        }
      }

      setTimeout(() => {
        this.moveNext(event);
      }, 1000);
    },
    startQuiz () {
      axios.post('http://poshmark-trivia-server.herokuapp.com/api/users/newuser', {
        name: this.name,
        is_admin: false
      })
      .then(function (response) {
        console.log(response);
      });
      this.screenName = 'quiz';
      this.countDown = 10;
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
        if (this.countDown > 0)
          this.countDownTimer();
      }
    },
    async readQuestions () {
      const response = await axios.get(`http://poshmark-trivia-server.herokuapp.com/api/questions/${this.level}`);
      if (response && response.data) {
       this.questionList = response.data;
      }
    },
    nextLevel () {
      this.level++;
      this.screenName = 'quiz';
      this.questionNumber = 0;
      this.readQuestions();
    }
  },
  mounted () {
    this.readQuestions(1);
    setTimeout(() => { this.screenName = 'start'; }, 2000);
  }
};
</script>