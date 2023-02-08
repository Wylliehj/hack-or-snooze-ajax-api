"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story) {
  // console.debug("generateStoryMarkup", story);

  const hostName = story.getHostName();
  return $(`
      <li id="${story.storyId}">
        <input type="checkbox" id="${story.storyId}"/>
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
}

/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
  console.debug("putStoriesOnPage");

  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
}

async function submitNewStory(event){
  console.debug('submitNewStory');
  
  const author = $('#create-author').val();
  const title = $('#create-title').val();
  const url = $('#create-url').val();

  const newStory = {
    author,
    title,
    url
  };
  
  const story = await storyList.addStory(currentUser, newStory)
  
  const displayStory = generateStoryMarkup(story);
  $allStoriesList.prepend(displayStory);

  $navSubmit.slideUp();
  $navSubmit[0].reset();
}

$navSubmit.on('submit', submitNewStory)

// Favorites or unfavorites a story by checking the status of the check box

async function favoriteStory(event){
  const token = currentUser.loginToken
  const username = currentUser.username
  const $storyFavorited = $(event.target).closest('li').attr('id')
  const story = storyList.stories.find( x => x.storyId === $storyFavorited)
  
  if ($(event.target).is(':checkbox')){
    
    
    if($(event.target).is(':checked')){
      
      const response = await axios.post(`${BASE_URL}/users/${username}/favorites/${$storyFavorited}`, { token })
      currentUser.addFavorite(story)
      
    } else{
      
      const response = await axios.delete(`${BASE_URL}/users/${username}/favorites/${$storyFavorited}`, 
      {data: { token }})
      currentUser.removeFavorite(story)
        
    }     
  }
}

$allStoriesList.on('click', favoriteStory)
$favoritesList.on('click', favoriteStory)


function putFavoritesOnPage() {
  $favoritesList.empty()
  const favoritesArr = currentUser.favorites

  for(let fav of favoritesArr){

    const story = generateStoryMarkup(fav)
    $favoritesList.append(story)
    $(`li#${fav.storyId} input`).prop('checked', true)
  }
}

function putMyStoriesOnPage(){
  $myStories.empty();
  const myStoriesArr = currentUser.ownStories

  for(let stories of myStoriesArr){

    const story = generateMyStoriesMarkup(stories)
    $myStories.append(story)
  }
}

function generateMyStoriesMarkup(story) {
  // console.debug("generateStoryMarkup", story);

  const hostName = story.getHostName();
  return $(`
      <li id="${story.storyId}">
        <button id="${story.storyId}">Delete</button>
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
}

async function deleteStory(event){
  const token = currentUser.loginToken;
  const $deletedStory = $(event.target).closest('li').attr('id');
  const story = currentUser.ownStories.find( x => x.storyId === $deletedStory);

  await axios.delete(`${BASE_URL}/stories/${$deletedStory}`, {data: {token, } });

  currentUser.deleteStory(story);
  putMyStoriesOnPage()
}

$myStories.on('click', deleteStory)

