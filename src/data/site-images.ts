import type { ImageMetadata } from "astro";

import afterStove from "../assets/images/after_stove.webp";
import afterStoveSmall from "../assets/images/after_stove-560.webp";
import avatarAnna from "../assets/images/avatar_anna.webp";
import avatarJames from "../assets/images/avatar_james.webp";
import avatarSarah from "../assets/images/avatar_sarah.webp";
import beforeStove from "../assets/images/before_stove.webp";
import beforeStoveSmall from "../assets/images/before_stove-560.webp";
import brightCleanLivingRoom from "../assets/images/bright_clean_living_room.webp";
import cleanerPortraitHero from "../assets/images/cleaner_portrait_hero.webp";
import cleanerPortraitHeroSmall from "../assets/images/cleaner_portrait_hero-510.webp";
import founderPau from "../assets/images/founder_pau.webp";
import founderStefania from "../assets/images/founder_stefania.webp";
import melbourneSuburbAerial from "../assets/images/melbourne_suburb_aerial.webp";
import miaTheCat from "../assets/images/mia_the_cat.webp";

export interface ReviewWithAvatar {
  name: string;
  stars: number;
  text: string;
  avatar: ImageMetadata;
  meta: string;
  defaultSuburb: string;
}

export {
  afterStove,
  afterStoveSmall,
  avatarAnna,
  avatarJames,
  avatarSarah,
  beforeStove,
  beforeStoveSmall,
  brightCleanLivingRoom,
  cleanerPortraitHero,
  cleanerPortraitHeroSmall,
  founderPau,
  founderStefania,
  melbourneSuburbAerial,
  miaTheCat,
};
