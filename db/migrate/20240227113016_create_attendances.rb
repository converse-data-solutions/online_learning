class CreateAttendances < ActiveRecord::Migration[7.0]
  def change
    create_table :attendances do |t|
      t.datetime :class_date
      t.boolean :status, default: true
      t.references :user_course, null: false, foreign_key: true

      t.timestamps
    end
  end
end
