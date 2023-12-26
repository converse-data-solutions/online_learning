// Custom Right-Stepper
function stepperLoop() {
  const active = {
    stepper: 1,
  };

  const slideStepper = function (element) {
    $(".outer-div, .line, .circle, h2").removeClass(
      "active-outerdiv fineshed-outerdiv active-circle fineshed-circle text-active text-fineshed fineshed-line"
    );

    const currentStep = element.replace("step-", "");

    for (let i = 1; i <= currentStep; i++) {
      const stepId = `#step-${i}`;
      const textId = `#text${i}`;

      if (i == currentStep) {
        $(`${stepId} .outer-div`).addClass("active-outerdiv");
        $(`${stepId} .circle`).addClass("active-circle");
        $(`${textId}`).addClass("text-active");
      } else {
        $(`${stepId} .outer-div`).addClass("fineshed-outerdiv");
        $(`${stepId} .circle`).addClass("fineshed-circle");
        $(`${textId}`).addClass("text-fineshed");
      }

      if (i < currentStep) {
        const lineId = `#line-${i}`;
        $(`${lineId} .line`).addClass("fineshed-line");
      }
    }
  };

  const buttonSlideStepper = function () {
    if (active.stepper < sectionsSize) {
      slideStepper(`step-${active.stepper + 1}`);
      active.stepper += 1;
    }
  };
  $(".containers").on("click", function () {
    const elementId = $(this).attr("id");
    slideStepper(elementId);
  });

  $(".circle").on("click", function (event) {
    const containerId = $(this).closest(".containers").attr("id");
    const currentStep = containerId.replace("step-", "");
    if (currentStep > 1) {
      slideStepper(`step-${currentStep}`);
      active.stepper = parseInt(currentStep);
    }
  });

  $("#next-button").on("click", function () {
    buttonSlideStepper();
  });

  slideStepper(`step-${active.stepper}`);
}
$(document).ready(function () {
  stepperLoop();
  $(document).on("turbo:render", function () {
    stepperLoop();
  });
});

$("#section-modal-close-btn").click();
$("#section-detele-modal-btn").click();