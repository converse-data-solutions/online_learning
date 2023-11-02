class CreateSubscriptions < ActiveRecord::Migration[7.0]
  def change
    create_table :subscriptions do |t|
      t.references :user, null: false, foreign_key: true
      t.string :status
      t.string :subscription_type
      t.decimal :amount_paid
      t.datetime :paid_at
      t.datetime :next_due
      t.string :stripe_subscription_id

      t.timestamps
    end
  end
end
