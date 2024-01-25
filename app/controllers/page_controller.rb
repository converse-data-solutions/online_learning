# frozen_string_literal: true

# This is an Pages controller
class PageController < ApplicationController
  before_action :authenticate_user!, only: %i[index]
  def index; end
end
