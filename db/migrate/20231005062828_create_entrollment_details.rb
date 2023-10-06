class CreateEntrollmentDetails < ActiveRecord::Migration[7.0]
  def change
    create_table :entrollment_details do |t|
      t.float :view_time
      t.boolean :status
      t.references :entrollment, null: false, foreign_key: true
      t.references :lesson, null: false, foreign_key: true

      t.timestamps
    end
  end
end
