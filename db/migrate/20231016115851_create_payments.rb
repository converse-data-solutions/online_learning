class CreatePayments < ActiveRecord::Migration[7.0]
  def change
    create_table :payments do |t|
      t.integer :amount
      t.datetime :paid_at
      t.references :user, null: false, foreign_key: true
      t.references :entrollment, foreign_key: { to_table: :entrollments, optional: true }

      t.timestamps
    end
  end
end
