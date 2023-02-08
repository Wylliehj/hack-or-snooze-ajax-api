"use strict";

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

/** Show main list of all stories when click site name */

function navAllStories(evt) {
  console.debug("navAllStories", evt);
  hidePageComponents();
  putStoriesOnPage();
}

$body.on("click", "#nav-all", navAllStories);

/** Show login/signup on click on "login" */

function navLoginClick(evt) {
  console.debug("navLoginClick", evt);
  hidePageComponents();
  $loginForm.show();
  $signupForm.show();
}

$navLogin.on("click", navLoginClick);

/** When a user first logins in, update the navbar to reflect that. */

function updateNavOnLogin() {
  console.debug("updateNavOnLogin");
  $(".main-nav-links").show();
  $navLogin.hide();
  $navLogOut.show();
  $navUserProfile.text(`${currentUser.username}`).show();
}

function navSubmitClick(){
  if($navSubmit.attr('style') == 'display: none;'){
    $navSubmit.show()
  } else{
    $navSubmit.hide()
  }

}
$('#submit').on('click', navSubmitClick)

function navFavoritesClick() {
  putFavoritesOnPage()
  hidePageComponents()

  if($favoritesList.attr('style')== 'display: none;'){
    $favoritesList.show()

  } 
}

$('#favorites').on('click', navFavoritesClick)

function navMyStoriesClick() {
  putMyStoriesOnPage()
  hidePageComponents()

  if($myStories.attr('style')== 'display: none;'){
    $myStories.show()
  } 
}

$('#my-stories').on('click', navMyStoriesClick)



