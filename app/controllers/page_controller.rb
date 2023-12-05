# frozen_string_literal: true

# This is an Pages controller
class PageController < ApplicationController
  def index
    # @sections = Course.last.sections
    @sections = Section.all
  end
end
