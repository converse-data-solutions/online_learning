# frozen_string_literal: true

class Trainer < User
  enum idcard_type: {
    Pan: 0,
    Aadhar: 1
  }
end
