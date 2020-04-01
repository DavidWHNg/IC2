<!DOCTYPE html>
<html>
<head>
  <title> specificity alternatives </title>
  <script src="resources/jsPsych/jspsych.js"></script>
  <script src="resources/jsPsych/plugins/jspsych-html-keyboard-response.js"></script>
  <script src="resources/jsPsych/plugins/jspsych-html-button-response.js"></script>
  <script src="resources/jsPsych/welcome_SONA.js"></script>
  <script src="resources/jsPsych/plugins/jspsych-external-html.js"></script>
  <script src="resources/jsPsych/plugins/jspsych-html-slider-response.js"></script>
  <script src="resources/jsPsych/plugins/jspsych-image-keyboard-response.js"></script>
  <script src="resources/jsPsych/plugins/jspsych-image-button-response.js"></script>
  <script src="resources/jsPsych/plugins/jspsych-image-slider-response.js"></script>
  <script src="resources/jsPsych/plugins/jspsych-survey-text.js"></script>
  <script src="resources/jsPsych/plugins/jspsych-survey-html-form.js"></script>
  <script src="resources/jsPsych/plugins/jspsych-survey-multi-choice.js"></script>
  <script src="resources/jsPsych/plugins/jspsych-fullscreen.js"></script>
  <script src="jatos.js"></script>
  <link href="resources/jsPsych/css/jspsych.css" rel="stylesheet" type="text/css"></link>
  <link href="resources/jsPsych/css/ethics.css" rel="stylesheet" type="text/css"></link>
</head>
<style>
</style>
<body>
  <div id="welcome"></div>
</body>
<script>


// load in consent and debrief forms 
var consent = {
    type: "external-html",
    url: "consent.html",
    cont_btn: "consented",
    check_fn: function () {
        jsPsych.data.addProperties(
            {
                wants_copy: document.getElementById("copy").checked,
            }
        );
        return true;
    }
};

var debrief = {
    type: "external-html",
    url: "debrief.html",
    cont_btn: "been_debriefed",
};

// load in images
var stim_list = [
  'resources/images/BLUE.png',
  'resources/images/RED.png',
];

 // white space to fill up where a shock image would be for easy formatting
var shock_display = 'resources/images/shock.png';
var blank = 'resources/images/BLANK.png';
var stim_broken = 'resources/images/BROKEN.png';
var stim_off = 'resources/images/GREY.png'

// set up counterbalancing + participant condition.
var num_random = Math.floor(Math.random() * 6) + 1;


// MTurk code
var turkcode = (Math.floor(Math.random()* 69696969) * 919).toString();
var mturk = 0 // turn to 1 if running mturk

// 1 = No alternative
// 2 = Generic alternative
// 3 = Specific alternative

// set up counterbalancing for red/blue as target cue
if (num_random % 2 === 0) {
  var cb = 1
  var stim_cue = 'resources/images/BLUE.png';
  var stim_context = 'resources/images/RED.png';
  var cue_colour = 'blue';
  var con_colour = 'red';

} else {
  var cb = 2
  var stim_cue = 'resources/images/RED.png';
  var stim_context = 'resources/images/BLUE.png';
  var cue_colour = 'red';
  var con_colour = 'blue';
};

if (num_random % 3 === 0) {
  group = 1
} else if (num_random % 2 === 0) {
  group = 2
  // stim_context = stim_broken
} else {
  group = 3
};

// console.log('group ' + group);
// console.log(cue_colour);


var questionnaire_demographics = {
  type: "survey-html-form",
  preamble: "<p> Before we begin, we would like to ask some demographic questions <p>",
  html:'<p> What is your age? <input name = age type = "text"> (Please input a number)</p>' +
  '<p> What is your gender? <input name = gender type = "text"> (Please input "M","F" or "O") </p>',
  post_trial_gap: 250,
  on_finish: function(data) {
    age = JSON.parse(data.responses).age;
    gender = JSON.parse(data.responses).gender;
    jsPsych.data.addProperties({
      age: age,
      gender: gender,
    })
  },
};

// loop if questions not answered properly
var questionnaire_demographics_loop = {
  timeline: [questionnaire_demographics],
  loop_function: function(data) {
    if((age > 0) &&
    ((gender == "M") ||
    (gender == "m") ||
    (gender == "F") ||
    (gender == "f") ||
    (gender == "O") ||
    (gender == "o"))) {
      return false;
    } else {
      return true;
    }
  }
};

var timeline_questionnaire_demographics = {
  timeline: [
    questionnaire_demographics_loop
  ]
};


// load stimuli (for A/B/C/D cells) into array to randomize

// Set up A B C D trials
// group 3 will see 2 lights, group 1 and 2 will see only 1 light (2 has hidden second light)
var whitespace = '<p> <font color = "white"> whitespace </font> </p>' //white space line for formatting

// 1 cue trials
  var cueon_display = {
    type: "html-keyboard-response",
    stimulus: '<img src = ' + stim_cue + '/>' +
    '<p></p>' +
    '<img src = ' + blank + '/>' +
    whitespace +
    whitespace,
    response_ends_trial: false,
    trial_duration: 1000
  };

  var cueoff_display = {
    type: "html-keyboard-response",
    stimulus: '<img src = ' + stim_off + '/>' +
    '<p></p>' +
    '<img src = ' + blank + '/>' +
    whitespace +
    whitespace,
    response_ends_trial: false,
    trial_duration: 1000,
  };

  var shock_cueon_delay = {
    type: "html-keyboard-response",
    stimulus: '<img src = ' + stim_cue + '/>' +
    '<p></p>' +
    "<img src = " + shock_display + "/>" +
    "<p> Mr X was shocked! </p>" +
    whitespace,
    response_ends_trial: false,
    trial_duration: 1000,
  };

  var shock_cueon_prompt = {
    type: "html-keyboard-response",
    stimulus: '<img src = ' + stim_cue + '/>' +
    '<p></p>' +
    "<img src = " + shock_display + "/>" +
    "<p> Mr X was shocked! </p>" +
    "<p> Press the spacebar to continue </p>",
    choices: [32],
    post_trial_gap: 250,
    on_finish: function(data) {
      trial_num++;
      // console.log(trial_num);
      jsPsych.data.get().addToLast({trial_num: trial_num});
    }
  };

  var noshock_cueon_delay = {
    type: "html-keyboard-response",
    stimulus: '<img src = ' + stim_cue + '/>' +
    '<p></p>' +
    '<p> Mr X was not shocked </p>'  +
    '<img src = ' + blank + '/>' +
    whitespace,
    response_ends_trial: false,
    trial_duration: 1000
  }

  var noshock_cueon_prompt = {
    type: "html-keyboard-response",
    stimulus: '<img src = ' + stim_cue + '/>' +
    '<p></p>' +
    '<p> Mr X was not shocked </p>'  +
    '<img src = ' + blank + '/>' +
    '<p> Press the spacebar to continue </p>',
    choices: [32],
    post_trial_gap: 250,
    on_finish: function(data) {
      trial_num++;
      // console.log(trial_num);
      jsPsych.data.get().addToLast({trial_num: trial_num});
    }
  };

  var shock_cueoff_delay = {
    type: "html-keyboard-response",
    stimulus: '<img src = ' + stim_off + '/>' +
    '<p></p>' +
    "<img src = " + shock_display + "/>" +
    "<p> Mr X was shocked! </p>" +
    whitespace,
    response_ends_trial: false,
    trial_duration: 1000
  };

  var shock_cueoff_prompt = {
    type: "html-keyboard-response",
    stimulus: '<img src = ' + stim_off + '/>' +
    '<p></p>' +
    "<img src = " + shock_display + "/>" +
    "<p> Mr X was shocked! </p>" +
    "<p> Press the spacebar to continue </p>",
    choices: [32],
    post_trial_gap: 250,
    on_finish: function(data) {
      trial_num++;
      // console.log(trial_num);
      jsPsych.data.get().addToLast({trial_num: trial_num});
    }
  };

  var noshock_cueoff_delay = {
    type: "html-keyboard-response",
    stimulus: '<img src = ' + stim_off + '/>' +
    '<p></p>' +
    '<p> Mr X was not shocked </p>'  +
    '<img src = ' + blank + '/>' +
    whitespace,
    response_ends_trial: false,
    trial_duration: 1000
  }

  var noshock_cueoff_prompt = {
    type: "html-keyboard-response",
    stimulus: '<img src = ' + stim_off + '/>' +
    '<p></p>' +
    '<p> Mr X was not shocked </p>'  +
    '<img src = ' + blank + '/>' +
    '<p> Press the spacebar to continue </p>',
    choices: [32],
    post_trial_gap: 250,
    on_finish: function(data) {
      trial_num++;
      // console.log(trial_num);
      jsPsych.data.get().addToLast({trial_num: trial_num});
    }
  };

  // 2 cue trials
  var cueon_contexton_display = {
    type: "html-keyboard-response",
    stimulus: '<img src = ' + stim_cue + '/><img src = ' + stim_context +'/>' +
    '<p></p>' +
    '<img src = ' + blank + '/>' +
    whitespace +
    whitespace,
    response_ends_trial: false,
    trial_duration: 1000,
  };

  var cueoff_contexton_display = {
    type: "html-keyboard-response",
    stimulus: '<img src = ' + stim_off + '/><img src = ' + stim_context + '/>' +
    '<p></p>' +
    '<img src = ' + blank + '/>' +
    whitespace +
    whitespace,
    response_ends_trial: false,
    trial_duration: 1000,
  };

  var cueon_contextoff_display = {
    type: "html-keyboard-response",
    stimulus: '<img src = ' + stim_cue + '/><img src = ' + stim_off + '/>' +
    '<p></p>' +
    '<img src = ' + blank + '/>' +
    whitespace +
    whitespace,
    response_ends_trial: false,
    trial_duration: 1000,
  };

  var cueoff_contextoff_display = {
    type: "html-keyboard-response",
    stimulus: '<img src = ' + stim_off + '/><img src = ' + stim_off + '/>' +
    '<p></p>' +
    '<img src = ' + blank + '/>' +
    whitespace +
    whitespace,
    response_ends_trial: false,
    trial_duration: 1000,
  };

  var shock_cueon_contexton_delay = {
    type: "html-keyboard-response",
    stimulus: '<img src = ' + stim_cue + '/><img src = ' + stim_context +'/>' +
    '<p></p>' +
    "<img src = " + shock_display + "/>" +
    "<p> Mr X was shocked! </p>" +
    whitespace,
    response_ends_trial: false,
    trial_duration: 1000,
  };

  var shock_cueon_contexton_prompt = {
    type: "html-keyboard-response",
    stimulus: '<img src = ' + stim_cue + '/><img src = ' + stim_context +'/>' +
    '<p></p>' +
    "<img src = " + shock_display + "/>" +
    "<p> Mr X was shocked! </p>" +
    "<p> Press the spacebar to continue </p>",
    choices: [32],
    post_trial_gap: 250,
    on_finish: function(data) {
      trial_num++;
      // console.log(trial_num);
      jsPsych.data.get().addToLast({trial_num: trial_num});
    }
  };

  var shock_cueoff_contexton_delay = {
    type: "html-keyboard-response",
    stimulus: '<img src = ' + stim_off + '/><img src = ' + stim_context +'/>' +
    '<p></p>' +
    "<img src = " + shock_display + "/>" +
    "<p> Mr X was shocked! </p>" +
    whitespace,
    response_ends_trial: false,
    trial_duration: 1000,
  };

  var shock_cueoff_contexton_prompt = {
    type: "html-keyboard-response",
    stimulus: '<img src = ' + stim_off + '/><img src = ' + stim_context +'/>' +
    '<p></p>' +
    "<img src = " + shock_display + "/>" +
    "<p> Mr X was shocked! </p>" +
    "<p> Press the spacebar to continue </p>",
    choices: [32],
    post_trial_gap: 250,
    on_finish: function(data) {
      trial_num++;
      // console.log(trial_num);
      jsPsych.data.get().addToLast({trial_num: trial_num});
    }
  };

  var noshock_cueon_contextoff_delay = {
    type: "html-keyboard-response",
    stimulus: '<img src = ' + stim_cue + '/>' + '<img src = ' + stim_off + '/>' +
    '<p></p>' +
    '<p> Mr X was not shocked </p>'  +
    '<img src = ' + blank + '/>' +
    whitespace,
    response_ends_trial: false,
    trial_duration: 1000
  }

  var noshock_cueon_contextoff_prompt = {
    type: "html-keyboard-response",
    stimulus: '<img src = ' + stim_cue + '/>' + '<img src = ' + stim_off + '/>' +
    '<p></p>' +
    '<p> Mr X was not shocked </p>'  +
    '<img src = ' + blank + '/>' +
    '<p> Press the spacebar to continue </p>',
    choices: [32],
    post_trial_gap: 250,
    on_finish: function(data) {
      trial_num++;
      // console.log(trial_num);
      jsPsych.data.get().addToLast({trial_num: trial_num});
    }
  };

  var noshock_cueoff_contextoff_delay = {
    type: "html-keyboard-response",
    stimulus: '<img src = ' + stim_off + '/>' + '<img src = ' + stim_off + '/>' +
    '<p></p>' +
    '<p> Mr X was not shocked </p>'  +
    '<img src = ' + blank + '/>' +
    whitespace,
    response_ends_trial: false,
    trial_duration: 1000
  }

  var noshock_cueoff_contextoff_prompt = {
    type: "html-keyboard-response",
    stimulus: '<img src = ' + stim_off + '/>' + '<img src = ' + stim_off + '/>' +
    '<p></p>' +
    '<p> Mr X was not shocked </p>'  +
    '<img src = ' + blank + '/>' +
    '<p> Press the spacebar to continue </p>',
    choices: [32],
    post_trial_gap: 250,
    on_finish: function(data) {
      trial_num++;
      // console.log(trial_num);
      jsPsych.data.get().addToLast({trial_num: trial_num});
    }
  };

// set up training trials for A B C D cells (contingency table)
trial_num = 0;

  if (group < 3) {
    var training_trialA = {
      timeline: [
        cueon_display,
        shock_cueon_delay,
        shock_cueon_prompt
      ],
      data: {
        phase: 'training',
        trialtype: 'A',
      },
    };

    var training_trialB = {
      timeline: [
        cueon_display,
        noshock_cueon_delay,
        noshock_cueon_prompt
      ],
      data: {
        phase: 'training',
        trialtype: 'B',
      },
    };

    var training_trialC = {
      timeline: [
        cueoff_display,
        shock_cueoff_delay,
        shock_cueoff_prompt
      ],
      data: {
        phase: 'training',
        trialtype: 'C',
      },
    };

    var training_trialD = {
      timeline: [
        cueoff_display,
        noshock_cueoff_delay,
        noshock_cueoff_prompt
      ],
      data: {
        phase: 'training',
        trialtype: 'D',
      },
    }
  } else if (group == 3) {
    var training_trialA = {
      timeline: [
        cueon_contexton_display,
        shock_cueon_contexton_delay,
        shock_cueon_contexton_prompt
      ],
      data: {
        phase: 'training',
        trialtype: 'A',
      },
    };

    var training_trialB = {
      timeline: [
        cueon_contextoff_display,
        noshock_cueon_contextoff_delay,
        noshock_cueon_contextoff_prompt
      ],
      data: {
        phase: 'training',
        trialtype: 'B',
      },
    };

    var training_trialC = {
      timeline: [
        cueoff_contexton_display,
        shock_cueoff_contexton_delay,
        shock_cueoff_contexton_prompt
      ],
      data: {
        phase: 'training',
        trialtype: 'C',
      },
    };

    var training_trialD = {
      timeline: [
        cueoff_contextoff_display,
        noshock_cueoff_contextoff_delay,
        noshock_cueoff_contextoff_prompt
      ],
      data: {
        phase: 'training',
        trialtype: 'D',
      },
    }
  };



// input distribution of training trials per block (18/6/6/2)
var num_training_trialA = 18;
var num_training_trialB = 6;
var num_training_trialC = 6;
var num_training_trialD = 2;

var num_training_trialblocks = 2;

// set up training trial order for all blocks
var timeline_training_trials = [];

var training_trials_intro_delay = {
  type: "html-keyboard-response",
  stimulus: "<p> Thank you, the task will begin shortly </p>",
  response_ends_trial: false,
  trial_duration: 2000,
  post_trial_gap: 250,
};

timeline_training_trials = timeline_training_trials.concat(training_trials_intro_delay);

// loop to add as many A/B/C/D trials into a block as inputted above
for (var j = 1; j <= num_training_trialblocks; j++) {
  temp_training_blockorder = [];

  for (var i = 1; i <= num_training_trialA; i++) {
    temp_training_blockorder = temp_training_blockorder.concat(training_trialA)
  };

  for (var i = 1; i <= num_training_trialB; i++) {
    temp_training_blockorder = temp_training_blockorder.concat(training_trialB)
  };

  for (var i = 1; i <= num_training_trialC; i++) {
    temp_training_blockorder = temp_training_blockorder.concat(training_trialC)
  };

  for (var i = 1; i <= num_training_trialD; i++) {
    temp_training_blockorder = temp_training_blockorder.concat(training_trialD)
  };

  // randomise the temporary block and add onto overall trial timeline for each loop (number of blocks)
  temp_training_blockorder = jsPsych.randomization.shuffle(temp_training_blockorder);
  timeline_training_trials = timeline_training_trials.concat(temp_training_blockorder);
};

// Set up test trials:
  var test_causalratings_cue = {
    type: "html-slider-response",
    stimulus: '<img src = ' + stim_cue + '> </img>',
    labels: [
      "<p> Definitely prevents shock </p>",
      "<p> Has no effect on shock </p>",
      "<p> Definitely causes shock <p>"
    ],
    button_label: "Continue",
    require_movement: true,
    prompt: "<p> To what extent did this light cause or prevent shock? </p>",
    post_trial_gap: 250,
    min: -100,
    max: 100,
    start: 0,
    data: {
      trialtype: "cr_cue",
      trialcategory: "cr"
    },
  };

  var test_causalratings_context = {
    type: "html-slider-response",
    stimulus: '<img src = ' + stim_context + '> </img>',
    labels: [
      "<p> Definitely prevents shock </p>",
      "<p> Has no effect on shock </p>",
      "<p> Definitely causes shock <p>"
    ],
    button_label: "Continue",
    require_movement: true,
    prompt: "<p> To what extent did this light cause or prevent shock? </p>",
    post_trial_gap: 250,
    min: -100,
    max: 100,
    start: 0,
    data: {
      trialtype: "cr_con",
      trialcategory: "cr"
    },
  };

if (group == 2) {
  var test_frequency_cueon = {
    type: "html-slider-response",
    stimulus: '<img src = ' + stim_cue + '> </img>',
    labels: [
      "<p> Shocked 0 times </p>",
      "<p> Shocked 50 times </p>",
      "<p> Shocked 100 times <p>"
    ],
    button_label: "Continue",
    require_movement: true,
    prompt: "<p> Imagine Mr X observed the shock machine 100 times and only saw the <b>front</b> light on.</p>" +
      "<p> How many times out of 100 do you predict Mr X will be shocked? </p>",
    post_trial_gap: 250,
    data: {
      trialtype: "fr_cue",
      trialcategory: "fr"
    },
  };

  var test_frequency_cueoff = {
    type: "html-slider-response",
    stimulus: '<img src = ' + stim_off + '> </img>',
    labels: [
      "<p> Shocked 0 times </p>",
      "<p> Shocked 50 times </p>",
      "<p> Shocked 100 times <p>"
    ],
    button_label: "Continue",
    require_movement: true,
    prompt: "<p> Imagine Mr X observed the shock machine 100 times and only saw the <b>front</b> light off.</p>" +
      "<p> How many times out of 100 do you predict Mr X will be shocked? </p>",
    post_trial_gap: 250,
    data: {
      trialtype: "fr_off",
      trialcategory: "fr"
    },
  };

  var test_frequency_conon = {
    type: "html-slider-response",
    stimulus: '<img src = ' + stim_context + '> </img>',
    labels: [
      "<p> Shocked 0 times </p>",
      "<p> Shocked 50 times </p>",
      "<p> Shocked 100 times <p>"
    ],
    button_label: "Continue",
    require_movement: true,
    prompt: "<p> Imagine Mr X observed the shock machine 100 times and only saw the <b>rear</b> light on.</p>" +
      "<p> How many times out of 100 do you predict Mr X will be shocked? </p>",
    post_trial_gap: 250,
    data: {
      trialtype: "fr_conon",
      trialcategory: "fr"
    },
  };

  var test_frequency_conoff = {
    type: "html-slider-response",
    stimulus: '<img src = ' + stim_off + '> </img>',
    labels: [
      "<p> Shocked 0 times </p>",
      "<p> Shocked 50 times </p>",
      "<p> Shocked 100 times <p>"
    ],
    button_label: "Continue",
    require_movement: true,
    prompt: "<p> Imagine Mr X observed the shock machine 100 times and only saw the <b>rear</b> light off.</p>" +
      "<p> How many times out of 100 do you predict Mr X will be shocked? </p>",
    post_trial_gap: 250,
    data: {
      trialtype: "fr_conoff",
      trialcategory: "fr"
    },
  };
} else {
  var test_frequency_cueon = {
    type: "html-slider-response",
    stimulus: '<img src = ' + stim_cue + '> </img>',
    labels: [
      "<p> Shocked 0 times </p>",
      "<p> Shocked 50 times </p>",
      "<p> Shocked 100 times <p>"
    ],
    button_label: "Continue",
    require_movement: true,
    prompt: "<p> Imagine Mr X observed the shock machine 100 times and only saw this light.</p>" +
      "<p> How many times out of 100 do you predict Mr X will be shocked? </p>",
    post_trial_gap: 250,
    data: {
      trialtype: "fr_cue",
      trialcategory: "fr"
    },
  };

  var test_frequency_cueoff = {
    type: "html-slider-response",
    stimulus: '<img src = ' + stim_off + '> </img>',
    labels: [
      "<p> Shocked 0 times </p>",
      "<p> Shocked 50 times </p>",
      "<p> Shocked 100 times <p>"
    ],
    button_label: "Continue",
    require_movement: true,
    prompt: "<p> Imagine Mr X observed the shock machine 100 times and the light was always off.</p>" +
      "<p> How many times out of 100 do you predict Mr X will be shocked? </p>",
    post_trial_gap: 250,
    data: {
      trialtype: "fr_off",
      trialcategory: "fr"
    },
  };
}

  var test_frequency_cueon_contexton = {
    type: "html-slider-response",
    stimulus: '<img src = ' + stim_cue + '/><img src = ' + stim_context + '/>',
    labels: [
      "<p> Shocked 0 times </p>",
      "<p> Shocked 50 times </p>",
      "<p> Shocked 100 times <p>"
    ],
    button_label: "Continue",
    require_movement: true,
    prompt: "<p> Imagine Mr X observed the shock machine 100 times and only saw these lights.</p>" +
      "<p> How many times out of 100 do you predict Mr X will be shocked? </p>",
    post_trial_gap: 250,
    data: {
      trialtype: "fr_cueon",
      trialcategory: "fr"
    },
  };

  var test_frequency_cueoff_contexton = {
    type: "html-slider-response",
    stimulus: '<img src = ' + stim_off + '/><img src = ' + stim_context + '/>',
    labels: [
      "<p> Shocked 0 times </p>",
      "<p> Shocked 50 times </p>",
      "<p> Shocked 100 times <p>"
    ],
    button_label: "Continue",
    require_movement: true,
    prompt: "<p> Imagine Mr X observed the shock machine 100 times and only saw this light.</p>" +
      "<p> How many times out of 100 do you predict Mr X will be shocked? </p>",
    post_trial_gap: 250,
    data: {
      trialtype: "fr_cueoff",
      trialcategory: "fr"
    },
  };
  var test_frequency_cueon_contextoff = {
    type: "html-slider-response",
    stimulus: '<img src = ' + stim_cue + '/><img src = ' + stim_off + '/>',
    labels: [
      "<p> Shocked 0 times </p>",
      "<p> Shocked 50 times </p>",
      "<p> Shocked 100 times <p>"
    ],
    button_label: "Continue",
    require_movement: true,
    prompt: "<p> Imagine Mr X observed the shock machine 100 times and only saw this light.</p>" +
      "<p> How many times out of 100 do you predict Mr X will be shocked? </p>",
    post_trial_gap: 250,
    data: {
      trialtype: "fr_cueon_conoff",
      trialcategory: "fr"
    },
  };

  var test_frequency_cueoff_contextoff = {
    type: "html-slider-response",
    stimulus: '<img src = ' + stim_off + '/><img src = ' + stim_off + '/>',
    labels: [
      "<p> Shocked 0 times </p>",
      "<p> Shocked 50 times </p>",
      "<p> Shocked 100 times <p>"
    ],
    button_label: "Continue",
    require_movement: true,
    prompt: "<p> Imagine Mr X observed the shock machine 100 times and the lights were always off.</p>" +
      "<p> How many times out of 100 do you predict Mr X will be shocked? </p>",
    post_trial_gap: 250,
    data: {
      trialtype: "fr_cueoff_conoff",
      trialcategory: "fr"
    },
  };

var test_openend_causalrelationship = {
  type: "survey-text",
  questions: [
    {prompt: "In a few sentences, how did you determine whether there was a causal relationship or not between the lights and shock?", rows: 10, columns: 80},
],
  post_trial_gap: 250,
  data: {
    trialtype: "oe_cr",
    trialcategory: "oe",
    phase: "test"
  }
};

var test_openend_othercauses = {
  type: "survey-text",
  questions: [
    {prompt: "<p>In this experiment, did you consider any causes of shock other than the coloured lights presented? If so, please describe them. </p>" + 
    "<p>If you did not consider any other causes of shock, please type 'no' and click 'Continue'.</p>", rows: 10, columns: 80}, 
],
  post_trial_gap: 250,
  data: {
    trialtype: "oe_oc",
    trialcategory: "oe",
    phase: "test"
  }
};

  if (group < 3) {
      var test_openend_cueofftrials = {
        type: "survey-text",
        questions: [
          { prompt: "On some trials, Mr X observed that the light was off but a shock still occurred.</p>" +
          "<p>What did you think caused the shock?.</p>", rows: 10, columns: 80 },
        ],
        post_trial_gap: 250,
        data: {
          trialtype: "oe_ac",
          trialcategory: "oe",
          phase: "test"
        }
      };
  };
    //  else if (group == 3) {
    //   if (cue_colour == 'blue') {
    //     var test_openend_cueofftrials = {
    //       type: "survey-text",
    //       questions: [
    //         { prompt: "<p>On some trials, Mr X observed that the BLUE light was off but a shock still occurred.</p>" +
    //         "<p>What did you think caused the shock?.</p>", rows: 10, columns: 80 },
    //       ],
    //       post_trial_gap: 250,
    //       data: {
    //         trialtype: "oe_ac",
    //         trialcategory: "oe",
    //         phase: "test"
    //       }
    //     };
    //   } else if (cue_colour == 'red') {
    //     var test_openend_cueofftrials = {
    //       type: "survey-text",
    //       questions: [
    //         { prompt: "<p>On some trials, Mr X observed that the RED light was off but a shock still occurred.</p>" +
    //         "<p>What did you think caused the shock?.</p>", rows: 10, columns: 80 },
    //       ],
    //       post_trial_gap: 250,
    //       data: {
    //         trialtype: "oe_ac",
    //         trialcategory: "oe",
    //         phase: "test"
    //       }
    //     };
    //   }
    // };

// loop if open ended question not answered properly (minimum string length = 2 for "no")
// var test_openend_othercauses_loop = {
//   timeline: [test_openend_othercauses],
//   loop_function: function(data) {
//     if(JSON.parse(data.responses.Q0).length < 2) {
//       return false;
//     } else {
//       return true;
//     }
//   }
// };


if (group == 1) {
  var test_causalratings_block = {
    timeline: jsPsych.randomization.shuffle([
      test_causalratings_cue,
    ]),
    data: {
      phase: 'test'
    }
  };

  var test_frequency_block = {
    timeline: jsPsych.randomization.shuffle([
      test_frequency_cueon,
      test_frequency_cueoff,
    ]),
    data: {
      phase: 'test'
    }
  };
} else if (group == 2) {
  var test_causalratings_block = {
    timeline: jsPsych.randomization.shuffle([
      test_causalratings_cue,
      test_causalratings_context,
    ]),
    data: {
      phase: 'test'
    }
  };

  var test_frequency_block = {
    timeline: [
      // no shuffle because questions get really confusing (same stimuli for off light, but text different)
      test_frequency_cueon,
      test_frequency_cueoff,
      test_frequency_conon,
      test_frequency_conoff,
    ],
    data: {
      phase: 'test'
    }
  };
} else if (group == 3) {
  var test_causalratings_block = {
    timeline: jsPsych.randomization.shuffle([
      test_causalratings_cue,
      test_causalratings_context,
    ]),
    data: {
      phase: 'test'
    }
  };

  var test_frequency_block = {
    timeline: jsPsych.randomization.shuffle([
      test_frequency_cueon_contexton,
      test_frequency_cueoff_contexton,
      test_frequency_cueon_contextoff,
      test_frequency_cueoff_contextoff,
    ]),
    data: {
      phase: 'test'
    }
  };
};

var timeline_test_trials = {
  timeline: [
    test_causalratings_block,
    test_frequency_block,
    test_openend_causalrelationship,
    test_openend_othercauses
  ],
};

if (group < 3) {
  timeline_test_trials.timeline.push(test_openend_cueofftrials)
};

// welcome
  if (mturk == 1) {
    var welcome_delay = {
      type: "html-keyboard-response",
      stimulus: "<p> Welcome to the experiment! <p>" +
        "<p> Please pay attention to <b>all tasks</b> and read <b>all instructions</b> carefully.</p>" +
        "<p> Depending on the size of your screen, you may have to scroll down some pages to observe all the information to complete your tasks. For your convenience, please change your browser to fullscreen mode.</p>" +
        '<p> We also ask that you do <b>not</b> write anything down. It will interfere with the results ' +
        'and will not help you complete the tasks or finish faster.</p>' +
        whitespace,
      response_ends_trial: false,
      trial_duration: 8000,
    };

    var welcome_prompt = {
      type: "html-keyboard-response",
      stimulus: "<p> Welcome to the experiment! <p>" +
        "<p> Please pay attention to <b>all tasks</b> and read <b>all instructions</b> carefully.</p>" +
        "<p> Depending on the size of your screen, you may have to scroll down some pages to observe all the information to complete your tasks. For your convenience, please change your browser to fullscreen mode.</p>" +
        '<p> We also ask that you do <b>not</b> write anything down. It will interfere with the results ' +
        'and will not help you complete the tasks or finish faster.</p>' +
        '<p>Press spacebar to continue</p>',
      choices: [32],
    };

    var welcome2_delay = {
      type: "html-keyboard-response",
      stimulus: '<p>If anything goes wrong during the experiment, please take a screenshot ' +
        'and notify the requester. Do <b>not</b> press the BACK button or quit out of ' +
        ' the program. This will make it hard for you to get paid.</p>' +
        '<p>If you complete the task, you will get your payment no matter what. ' +
        'Please take your time and think about your predictions and judgements seriously. </p>' +
        whitespace,
      response_ends_trial: false,
      trial_duration: 5000,
    };

    var welcome2_prompt = {
      type: "html-keyboard-response",
      stimulus: '<p>If anything goes wrong during the experiment, please take a screenshot ' +
        'and notify the requester. Do <b>not</b> press the BACK button or quit out of ' +
        ' the program. This will make it hard for you to get paid.</p>' +
        '<p>If you complete the task, you will get your payment no matter what. ' +
        'Please take your time and think about your predictions and judgements seriously. </p>' +
        "<p> Press spacebar to continue </p>",
      choices: [32],
    };
  } else {
    var welcome_delay = {
      type: "html-keyboard-response",
      stimulus: "<p> Welcome to the experiment! <p>" +
        "<p> Please pay attention to <b>all tasks</b> and read <b>all instructions</b> carefully.</p>" +
        '<p> We also ask that you do <b>not</b> write anything down. It will interfere with the results ' +
        'and will not help you complete the tasks or finish faster.</p>' +
        whitespace,
      response_ends_trial: false,
      trial_duration: 8000,
    };

    var welcome_prompt = {
      type: "html-keyboard-response",
      stimulus: "<p> Welcome to the experiment! <p>" +
        "<p> Please pay attention to <b>all tasks</b> and read <b>all instructions</b> carefully.</p>" +
        '<p> We also ask that you do <b>not</b> write anything down. It will interfere with the results ' +
        'and will not help you complete the tasks or finish faster.</p>' +
        '<p>Press spacebar to continue</p>',
      choices: [32],
    };

    var welcome2_delay = {
      type: "html-keyboard-response",
      stimulus: '<p>If anything goes wrong during the experiment, please ' +
        'notify the experimenter. Do <b>not</b> press the BACK button or quit out of ' +
        ' the program. This will delay the experiment and make it harder for you to get your SONA credits.</p>' +
        '<p>If you complete the task, you will get your credits no matter what. ' +
        'Please take your time and think about your predictions and judgements seriously. </p>' +
        whitespace,
      response_ends_trial: false,
      trial_duration: 8000,
    };

    var welcome2_prompt = {
      type: "html-keyboard-response",
      stimulus: '<p>If anything goes wrong during the experiment, please ' +
        'notify the experimenter. Do <b>not</b> press the BACK button or quit out of ' +
        ' the program. This will delay the experiment and make it harder for you to get your SONA credits.</p>' +
        '<p>If you complete the task, you will get your credits no matter what. ' +
        'Please take your time and think about your predictions and judgements seriously. </p>' +
        "<p> Press spacebar to continue </p>",
      choices: [32],
    };
  };

var timeline_welcome = {
  timeline: [
    welcome_delay,
    welcome_prompt,
    welcome2_delay,
    welcome2_prompt,
  ]
};

// TRAINING instructions
if (group == 1) {
  var training_instructions_stimon_delay = {
    type: "html-keyboard-response",
    stimulus: '<img src = ' + stim_cue + '/>' +
    "<p> In this experiment, Mr X discovers a strange machine that delivers electric shocks.</p>" +
    "<p> Mr X also notices a coloured light on the machine's interface.</p>" +
    "<p> The coloured circle above indicates the light is currently <b>ON</b>.</p>" +
    whitespace +
    whitespace,
    response_ends_trial: false,
    trial_duration: 5000
  };

  var training_instructions_stimon_prompt = {
    type: "html-keyboard-response",
    stimulus: '<img src = ' + stim_cue + '/>'+
    "<p> In this experiment, Mr X discovers a strange machine that delivers electric shocks.</p>" +
    "<p> Mr X also notices a coloured light on the machine's interface.</p>" +
    "<p> The coloured circle above indicates the light is currently <b>ON</b>.</p>" +
    whitespace +
    '<p> Press spacebar to continue </p>',
    choices:[32],
  };

  var training_instructions_stimoff_delay = {
    type: "html-keyboard-response",
    stimulus: '<img src = ' + stim_off + '/>'+
    "<p> The light also periodically turns on and off. The grey circle above indicates the light is <b>OFF</b> </p>" +
    "<p> In a moment you will observe the machine with Mr X. Each screen will indicate one occasion in which the light was either on or off and the shock either occurred or not.</p>" +
    "<p> Please use these observations to help Mr X determine whether there is any relationship between the light and shock. </p>" +
    "<p> This task should take no more than 5 minutes </p>" +
    whitespace +
    whitespace,
    response_ends_trial: false,
    trial_duration: 10000,
  };

  var training_instructions_stimoff_prompt = {
    type: "html-keyboard-response",
    stimulus: '<img src = ' + stim_off + '/>'+
    "<p> The light also periodically turns on and off. The grey circle above indicates the light is <b>OFF</b> </p>" +
    "<p> In a moment you will observe the machine with Mr X. Each screen will indicate one occasion in which the light was either on or off and the shock either occurred or not.</p>" +
    "<p> Please use these observations to help Mr X determine whether there is any relationship between the light and shock. </p>" +
    "<p> This task should take no more than 5 minutes </p>" +
    whitespace +
    '<p> Press spacebar to continue </p>',
    choices:[32],
  };

} else if (group == 2) {
  var training_instructions_stimon_delay = {
    type: "html-keyboard-response",
    stimulus: '<img src = ' + stim_cue + '/>' + 
    "<p> In this experiment, Mr X discovers a strange machine that delivers electric shocks.</p>" +
    "<p> Mr X also notices a coloured light on the machine's front interface.</p>" +
    "<p> The coloured circle above indicates the light is <b>ON</b>.</p>" +
    whitespace +
    whitespace,
    response_ends_trial: false,
    trial_duration: 5000
  };

  var training_instructions_stimon_prompt = {
    type: "html-keyboard-response",
    stimulus: '<img src = ' + stim_cue + '/>' + 
    "<p> In this experiment, Mr X discovers a strange machine that delivers electric shocks.</p>" +
    "<p> Mr X also notices a coloured light on the machine's front interface.</p>" +
    "<p> The coloured circle above indicates the light is <b>ON</b>.</p>" +
    whitespace +
    '<p> Press spacebar to continue </p>',
    choices:[32],
  };

  var training_instructions_stimrear_delay = {
    type: "html-keyboard-response",
    stimulus: '<img src = ' + stim_context + '/>' + 
    "<p> Mr X also notices that there is another coloured light on the <b>rear</b> of the machine.</p>" +
    "<p> The coloured circle above indicates the <b>rear</b> light is <b>ON</b>.</p>" +
    whitespace +
    whitespace +
    whitespace,
    response_ends_trial: false,
    trial_duration: 5000
  };

  var training_instructions_stimrear_prompt = {
    type: "html-keyboard-response",
    stimulus: '<img src = ' + stim_context + '/>' + 
    "<p> Mr X also notices that there is another coloured light on the <b>rear</b> of the machine.</p>" +
    "<p> The coloured circle above indicates the <b>rear</b> light is <b>ON</b>.</p>" +
    whitespace +
    whitespace +
    '<p> Press spacebar to continue </p>',
    choices:[32],
  };

  var training_instructions_stimoff_delay = {
    type: "html-keyboard-response",
    stimulus: '<img src = ' + stim_off + '/>' +
    "<p> Both the <b>front</b> and <b>rear</b> lights also periodically turn on and off.</p>" + 
    "<p>The grey circle above shows what either light looks like when they are <b>OFF</b> </p>" +
    whitespace +
    whitespace +
    whitespace,
    response_ends_trial: false,
    trial_duration: 5000
  };

  var training_instructions_stimoff_prompt = {
    type: "html-keyboard-response",
    stimulus: '<img src = ' + stim_off + '/>' +
    "<p> Both the <b>front</b> and <b>rear</b> lights also periodically turn on and off.</p>" + 
    "<p>The grey circle above shows what either light looks like when they are <b>OFF</b> </p>" +
    whitespace +
    whitespace +
    '<p> Press spacebar to continue </p>',
    choices:[32],
  };

  var training_instructions_task_delay = {
    type: "html-keyboard-response",
    stimulus: 
    "<p> In a moment you will observe the machine with Mr X. Each screen will indicate one occasion in which a light was either on or off and the shock either occurred or not. Unfortunately, Mr. X cannot see both lights at the same time, and so will observe either the <b>front</b> or <b>rear</b> light for the duration of the whole experiment.</p>" +
    "<p> Please use these observations to help Mr X determine whether there is any relationship between the lights and shock.</p>" +
    "<p> This task should take no more than 5 minutes </p>" +
    whitespace,
    response_ends_trial: false,
    trial_duration: 10000
  }

  var training_instructions_task_prompt = {
    type: "html-keyboard-response",
    stimulus: 
    "<p> In a moment you will observe the machine with Mr X. Each screen will indicate one occasion in which a light was either on or off and the shock either occurred or not. Unfortunately, Mr. X cannot see both lights at the same time, and so will observe either the <b>front</b> or <b>rear</b> light for the duration of the whole experiment.</p>" +
    "<p> Please use these observations to help Mr X determine whether there is any relationship between the lights and shock.</p>" +
    "<p> This task should take no more than 5 minutes </p>" +
    '<p> Press spacebar to continue </p>',
    choices:[32],
  }

} else if (group == 3) {
  var training_instructions_stimon_delay = {
    type: "html-keyboard-response",
    stimulus: '<img src = ' + stim_cue + '/><img src = ' + stim_context + '/>'+
    "<p> In this experiment, Mr X discovers a strange machine that delivers electric shocks.</p>" +
    "<p> Mr X also notices coloured lights on the machine's interface.</p>" +
    "<p> The coloured circles above indicate the lights are currently <b>ON</b>.</p>" +
    whitespace +
    whitespace,
    response_ends_trial: false,
    trial_duration: 5000
  };

  var training_instructions_stimon_prompt = {
    type: "html-keyboard-response",
    stimulus: '<img src = ' + stim_cue + '/><img src = ' + stim_context + '/>'+
    "<p> In this experiment, Mr X discovers a strange machine that delivers electric shocks.</p>" +
    "<p> Mr X also notices coloured lights on the machine's interface.</p>" +
    "<p> The coloured circles above indicate the lights are currently <b>ON</b>.</p>" +
    whitespace +
    '<p> Press spacebar to continue </p>',
    choices:[32],
  };

  var training_instructions_stimoff_delay = {
    type: "html-keyboard-response",
    stimulus: '<img src = ' + stim_off + '/><img src = ' + stim_off + '/>'+
    "<p> Both lights also periodically turn on and off. The grey circles above show what either light looks like when they are <b>OFF</b> </p>" +
    "<p> In a moment you will observe the machine with Mr X. Each screen will indicate one occasion in which the lights were either on or off and the shock either occurred or not.</p>" +
    "<p> Please use these observations to help Mr X determine whether there is any relationship between the lights and shock.</p>" +
    "<p> This task should take no more than 5 minutes </p>" +
    whitespace +
    whitespace,
    response_ends_trial: false,
    trial_duration: 10000,
  };

  var training_instructions_stimoff_prompt = {
    type: "html-keyboard-response",
    stimulus: '<img src = ' + stim_off + '/><img src = ' + stim_off + '/>' +
    "<p> Both lights also periodically turn on and off. The grey circles above show what either light looks like when they are <b>OFF</b> </p>" +
    "<p> In a moment you will observe the machine with Mr X. Each screen will indicate one occasion in which the lights were either on or off and the shock either occurred or not.</p>" +
    "<p> Please use these observations to help Mr X determine whether there is any relationship between the lights and shock. </p>" +
    "<p> This task should take no more than 5 minutes </p>" +
    whitespace +
    '<p> Press spacebar to continue </p>',
    choices:[32],
  };
};

// training instructions block
if (group == 2) {
    var timeline_training_instructions = {
      timeline: [
        training_instructions_stimon_delay,
        training_instructions_stimon_prompt,
        training_instructions_stimrear_delay,
        training_instructions_stimrear_prompt,
        training_instructions_stimoff_delay,
        training_instructions_stimoff_prompt,
        training_instructions_task_delay,
        training_instructions_task_prompt,
      ],
    };
  } else {
    var timeline_training_instructions = {
      timeline: [
        training_instructions_stimon_delay,
        training_instructions_stimon_prompt,
        training_instructions_stimoff_delay,
        training_instructions_stimoff_prompt,
      ],
    };
  };

//instruction check
var Q0_text = "What is the aim of the task?";
var Q0_answers = [
    "To shock Mr X with the machine as much as possible",
    "To prevent Mr X from getting shocked by the machine",
    "To determine whether or not the machine's lights are related to electric shocks"
  ];
var Q1_text = "What does a plain grey circle represent on the machine?";
var Q1_answers = [
  "The light is on",
  "The light is broken",
  "The light is off",
];
var correctstring = '{"Q0":"' + Q0_answers[2] + '","Q1":"' + Q1_answers[2] + '"}';

//instruction check loop
var instruction_check_block = [];

var instructioncorrect = false;
failedfirstcheck = false;

var instruction_check = {
  		type: "survey-multi-choice",
  		preamble: "<p> Please answer the following questions to confirm you understand the task instructions. </p>" +
  "<p><b> Please note, if you make a mistake, you will be asked to answer these questions again. </b> </p>",
  		questions: [
        {prompt: Q0_text, options: Q0_answers, name: "Q0",required: true},
        {prompt: Q1_text, options: Q1_answers, name: "Q1",required: true},
          ],
  		on_finish: function(data) {
  			if(data.responses == correctstring) {
          instructioncorrect = true;
        }
  		}
    };
    
    instruction_check_block = instruction_check_block.concat(instruction_check);

  	// incorrect response screen
  	var splash_incorrect = {
  		type: 'html-keyboard-response',
      stimulus: '<center>Unfortunately, at least one of your answers was incorrect. Please try again in 5 seconds. </center>',
      response_ends_trial: false,
      trial_duration: 5000,
      on_finish: function(data) {
        failedfirstcheck = true;
      }
  	};

  	// push it to a conditional node that only shows it if the response was wrong
  	var conditional_splash = {
  		timeline: [splash_incorrect],
  		conditional_function: function(data) {
            return !instructioncorrect // skip if correct
  	    }
    };
    
    instruction_check_block = instruction_check_block.concat(conditional_splash);

  	// finally, turn instruction check into loop block
  	var timeline_instruction_check = {
  		timeline: instruction_check_block,
  		loop_function: function(data) {
  	        //var action = true;
  	        return !instructioncorrect // stop looping if correct
        },
    }; 

// TEST instructions

var test_instructions1_delay = {
  type: "html-keyboard-response",
  stimulus: "<p> Thank you. </p>" +
  "<p> We will now ask you some questions regarding what you learnt about the shock machine </p>" +
  whitespace,
  response_ends_trial: false,
  trial_duration: 3000,
};

var test_instructions1_prompt = {
  type: "html-keyboard-response",
  choices:[32],
  stimulus: "<p> Thank you. </p>" +
  "<p> We will now ask you some questions regarding what you learnt about the shock machine </p>" +
  "<p> Press spacebar to continue </p>",

};

var test_instructions2_prompt = {
  type: "html-slider-response",
  stimulus:
  "<p> In the following trials, you will be presented with a question about the lights on the shock machine. </p>" +
  "<p> Please answer these questions by adjusting the slider on this scale. </p>" +
  "<p> Try making a response below on this example scale. </p>",
  labels: [0,
    100
  ],
  require_movement: true,
  post_trial_gap: 250
};

var test_instructions3_delay = {
  type: "html-keyboard-response",
  stimulus: "<p> Thank you, the questions will begin shortly </p>",
  response_ends_trial: false,
  trial_duration: 3000,
  post_trial_gap: 250
};

var timeline_test_instructions = {
  timeline: [
    test_instructions1_delay,
    test_instructions1_prompt,
    test_instructions2_prompt,
    test_instructions3_delay,
  ]
};

// experiment finished instructions
if (mturk == 1){
  var experiment_end_instructions_delay = {
  type: "html-keyboard-response",
  stimulus: "<p> The experiment has now concluded. Thank you for your participation.</p>" +
  "<p> Your completion code is </p>" + turkcode + "<p>To receive payment for the HIT, return to the Amazon Mechanical Turk page and enter this code. Please contact us if something goes wrong and we'll fix it as quickly as possible. </p>" +
  "<p> This page will automatically close in 1 minute. Feel free to exit the experiment once you've recorded your completion code. </p>",
  response_ends_trial: false,
  trial_duration: 60000,
  on_start: function() {
    jsPsych.data.addProperties({
            id: jatos.workerId,
            failedfirstcheck: failedfirstcheck
          })
            var resultJson = jsPsych.data.get().csv();
            jatos.submitResultData(resultJson);
        },
  on_finish: function() {
            var resultJson = jsPsych.data.get().csv();
            jatos.endStudy;
        },
  };
} else {
  var experiment_end_instructions_delay = {
  type: "html-keyboard-response",
  stimulus: "<p> The experiment has now concluded. Thank you for your participation!</p>" +
  "<p> Please notify the experimenter. </p>",
  response_ends_trial: false,
  trial_duration: 60000,
  on_start: function() {
    jsPsych.data.addProperties({
            id: jatos.workerId,
            failedfirstcheck: failedfirstcheck
          })
            var resultJson = jsPsych.data.get().csv();
            jatos.submitResultData(resultJson);
        },
  on_finish: function() {
            var resultJson = jsPsych.data.get().csv();
            jatos.endStudy;
        },
  };
}


// var experiment_end_instructions_prompt = {
//   type: "html-keyboard-response",
//   stimulus: "<p> The experiment has now concluded. Thank you for your participation.</p>" +
//   "<p> Your completion code is </p>" + turkcode + "<p>To receive payment for the HIT, return to the Amazon Mechanical Turk page and enter this code. Please contact us if something goes wrong and we'll fix it as quickly as possible. </p>" +
//   "<p> Press spacebar to exit the experiment </p>",
//   choices: [32]
// };

var timeline_experiment_end = {
  timeline: [
    experiment_end_instructions_delay,
    // experiment_end_instructions_prompt
  ]
};

// put it all together
var timeline = [];

timeline = timeline.concat(consent);
// timeline = timeline.concat(timeline_welcome);
// timeline = timeline.concat(timeline_questionnaire_demographics);
// timeline = timeline.concat(timeline_training_instructions);
// timeline = timeline.concat(timeline_instruction_check);
// timeline = timeline.concat(timeline_training_trials);
// timeline = timeline.concat(timeline_test_instructions);
// timeline = timeline.concat(timeline_test_trials);
// timeline = timeline.concat(timeline_experiment_end);
timeline = timeline.concat (debrief);

jatos.onLoad(function () {

// ---------- subject info ----------
var sona_id = jatos.urlQueryParameters.id;// jsPsych.data.getURLVariable("id");
var completion_url = "https://unsw-psy.sona-systems.com/webstudy_credit.aspx?experiment_id=1296&credit_token=5dece0015dce49e3aff8c7d968517dbd&survey_code=" + sona_id;

// add properties to each trial in the jsPsych data
jsPsych.data.addProperties({
  sona_id: sona_id, // turkcode: turkcode,
  group: group,
  cb: cb,
  cue_colour: cue_colour,
  con_colour: con_colour,
  turkcode: turkcode,
});

jsPsych.init({
  timeline: timeline,
  show_progress_bar: false,
  preload_images: [stim_list, shock_display, blank, stim_broken, stim_off],
  on_finish: function () {
    var result = jsPsych.data.get().json();
    jatos.submitResultData(result, function () {
      document.write('<div id="endscreen" class="endscreen" style="width:1000px"><div class="endscreen" style="text-align:center; border:0px solid; padding:10px; font-size:120%; width:800px; float:right"><p><br><br><br>' +
        finish_msg +
        '</p></div></div>')
    });
  },
});
});

</script>
</html>
