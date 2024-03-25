class AddColumnsToSchedules < ActiveRecord::Migration[7.0]
  def change
    add_reference :schedules, :user, null: false, foreign_key: true
    add_reference :schedules, :course, null: false, foreign_key: true
  end
end
