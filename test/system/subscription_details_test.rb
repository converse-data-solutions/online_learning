require "application_system_test_case"

class SubscriptionDetailsTest < ApplicationSystemTestCase
  setup do
    @subscription_detail = subscription_details(:one)
  end

  test "visiting the index" do
    visit subscription_details_url
    assert_selector "h1", text: "Subscription details"
  end

  test "should create subscription detail" do
    visit subscription_details_url
    click_on "New subscription detail"

    fill_in "Amount", with: @subscription_detail.amount
    fill_in "End date", with: @subscription_detail.end_date
    fill_in "Paid at", with: @subscription_detail.paid_at
    fill_in "Start date", with: @subscription_detail.start_date
    fill_in "Stripe subscription", with: @subscription_detail.stripe_subscription_id
    fill_in "Subscription", with: @subscription_detail.subscription_id
    fill_in "User", with: @subscription_detail.user_id
    click_on "Create Subscription detail"

    assert_text "Subscription detail was successfully created"
    click_on "Back"
  end

  test "should update Subscription detail" do
    visit subscription_detail_url(@subscription_detail)
    click_on "Edit this subscription detail", match: :first

    fill_in "Amount", with: @subscription_detail.amount
    fill_in "End date", with: @subscription_detail.end_date
    fill_in "Paid at", with: @subscription_detail.paid_at
    fill_in "Start date", with: @subscription_detail.start_date
    fill_in "Stripe subscription", with: @subscription_detail.stripe_subscription_id
    fill_in "Subscription", with: @subscription_detail.subscription_id
    fill_in "User", with: @subscription_detail.user_id
    click_on "Update Subscription detail"

    assert_text "Subscription detail was successfully updated"
    click_on "Back"
  end

  test "should destroy Subscription detail" do
    visit subscription_detail_url(@subscription_detail)
    click_on "Destroy this subscription detail", match: :first

    assert_text "Subscription detail was successfully destroyed"
  end
end
