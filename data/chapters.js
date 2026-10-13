// Original HCIM-first walkthrough, independently authored.
// Never recycle a step id: user progress is keyed by these IDs.
export const chapters = [
  {id:'01-lumbridge',number:'01',title:'Your Hardcore begins',region:'Lumbridge',subtitle:'Tutorial Island and early quests',goal:'Get started safely; collect quest items and finish Lumbridge clues.',steps:[
    ['c01-001','Finish Tutorial Island as a Hardcore Ironman','Double-check you selected the red Hardcore Ironman mode before leaving the island.','Essential'],
    ['c01-002','Get basic tools','Check your inventory for an axe and tinderbox, and find a spade. Keep the spade for X Marks the Spot.','Collect'],
    ['c01-003','Start X Marks the Spot','Find Veos in The Sheared Ram pub in Lumbridge and accept his treasure hunt.','Quest'],
    ['c01-004','Start Rune Mysteries','Speak to Duke Horacio upstairs in Lumbridge Castle. Finish the quest when the route takes you there.','Quest'],
    ['c01-005','Start The Restless Ghost','Talk to Father Aereck in the church. This prepares a future Prayer XP unlock.','Quest'],
    ['c01-006','Bank three raw meats for Druidic Ritual','From Lumbridge rats, chickens and cows, collect one RAW rat meat, RAW chicken and RAW beef. Do not cook them.','Collect'],
    ['c01-011','Train Thieving to level 5','Pickpocket men and heal when needed. Watch your Hitpoints carefully.','Active','Pickpocket failures cause damage; do not AFK at low HP.'],
    ['c01-007','Train Firemaking to 15','Chop and burn ordinary logs in a safe area. Keep one normal log for Monk’s Friend.','Low attention'],
    ['c01-008','X Marks clue 1: Bob’s shop','Dig by the north-west window of the house attached to Bob’s Brilliant Axes.','Quest'],
    ['c01-009','X Marks clue 2: castle kitchen','Dig behind Lumbridge Castle kitchen by the crate.','Quest'],
    ['c01-010','Collect the ghostspeak amulet','Speak to Father Urhney in Lumbridge Swamp. Bank the amulet for later.','Travel','Be attentive around swamp enemies.']
  ]},
  {id:'02-draynor',number:'02',title:'Early money and the first lamp',region:'Draynor / Port Sarim',subtitle:'Complete X Marks the Spot and gather food',goal:'Save the XP lamp for Herblore.',steps:[
    ['c02-001','Travel safely to Draynor','Bring your spade and food. Avoid aggressive jail guards.','Travel','Do not AFK past Draynor jail.'],
    ['c02-002','X Marks clue 3: near Leela','Dig north-west of Draynor jail and south of the wheat field, near Leela.','Quest'],
    ['c02-003','X Marks clue 4: pig pen','Dig in the Draynor pig pen to obtain the ancient casket.','Quest'],
    ['c02-004','Finish X Marks the Spot','Bring the casket to Veos at Port Sarim and claim the 300-XP lamp and coins.','Quest'],
    ['c02-005','Keep the lamp for Herblore','Do not redeem it yet. The lamp is not bankable; you can destroy it and reclaim it from Veos later.','Essential'],
    ['c02-007','Check warm-clothing options at Diango','Ask Diango about the rainbow scarf. If unavailable, use another verified Wintertodt warm item.','Optional'],
    ['c02-006','Stock cheap food and bank','Get wines or other food for travel and early quests; bank excess items.','Preparation']
  ]},
  {id:'03-ardougne',number:'03',title:'Woodcutting and warm clothing',region:'Ardougne',subtitle:'Monk’s Friend, cake stalls and Clue hunter outfit',goal:'Get 35 Woodcutting/Firemaking and two warm items.',steps:[
    ['c03-001','Travel to Ardougne','Take transport if available, otherwise use safer roads and carry food.','Travel'],
    ['c03-002','Prepare Monk’s Friend items','Get one normal log and a jug of water.','Collect'],
    ['c03-003','Start Monk’s Friend','Speak to Brother Omad in the monastery south of East Ardougne Zoo.','Quest'],
    ['c03-004','Retrieve the child’s blanket','Enter the thieves’ den west of the monastery and collect the blanket.','Active','Do not AFK in the thieves’ hideout.'],
    ['c03-005','Help Cedric and finish Monk’s Friend','Give the blanket to Omad, help Cedric using the log and water, and return for 2,000 Woodcutting XP.','Quest'],
    ['c03-006','Reach 35 Woodcutting and Firemaking','After the quest, cut normal logs to 15 Woodcutting then chop and burn oaks to both level 35.','Low attention'],
    ['c03-007','Collect Clue hunter gloves and boots','Dig at the clue spot by the oak tree north of East Ardougne, south-west of Fishing Guild. Confirm the exact spot on the OSRS Wiki if needed.','Collect'],
    ['c03-008','Bank cakes for questing','Steal cakes from Ardougne market from 5 Thieving. Carry food and avoid guards.','Semi-AFK','Guards and failed thefts can damage you.'],
    ['c03-009','Raise 7,000 gp for Daddy’s Home','At 20 Thieving, steal silk and sell it back after the cooldown, or use another safe moneymaker.','Skilling']
  ]},
  {id:'04-construction',number:'04',title:'Build your house',region:'Varrock',subtitle:'Daddy’s Home and early Construction',goal:'Unlock a house before Wintertodt.',steps:[
    ['c04-001','Travel to north-east Varrock','Meet Marlo in the estate agent’s house. Bring money for materials.','Travel'],
    ['c04-002','Start Daddy’s Home','Speak to Marlo and visit Old Man Yarlo in south-east Varrock.','Quest'],
    ['c04-003','Clear Yarlo’s broken furniture','Remove the old furniture and carpet, then talk to Yarlo.','Quest'],
    ['c04-004','Collect three waxwood logs','Search the crates in Yarlo’s house for the marked materials.','Collect'],
    ['c04-005','Visit the Varrock sawmill','Prepare waxwood planks, ten normal planks, five bolts of cloth and enough nails.','Collect'],
    ['c04-006','Rebuild Yarlo’s furniture','Use a hammer and saw on the construction hotspots and finish the repairs.','Quest'],
    ['c04-007','Claim the free house','Return to Marlo to finish Daddy’s Home and collect your free house and resources.','Quest'],
    ['c04-008','Optional: level 20 Construction','Use early planks to train Construction; Wintertodt brazier repairs scale with your Construction level.','Recommended']
  ]},
  {id:'05-herblore',number:'05',title:'Unlock Herblore',region:'Taverley',subtitle:'Druidic Ritual before Wintertodt',goal:'Unlock Herblore and rejuvenation potion preparation.',steps:[
    ['c05-001','Check the four raw meats','You need raw rat meat, raw beef, raw chicken and raw bear meat.','Collect'],
    ['c05-002','Get raw bear meat without Wilderness risk','Kill a bear outside Wilderness using a real safespot, preferably with Ranged or Magic.','Focused only','Bears can quickly kill a new Hardcore.'],
    ['c05-003','Start Druidic Ritual','Talk to Kaqemeex at the stone circle north of Taverley.','Quest'],
    ['c05-004','Speak to Sanfew','Visit Sanfew upstairs in Taverley’s Herblore shop.','Quest'],
    ['c05-005','Prepare for the dungeon','Bring all four meats, armour, food and an emergency teleport. If still at 10 HP, train safe combat first.','Focused only','Aggressive skeletons and animated suits of armour are dangerous at low level.'],
    ['c05-006','Enchant the four meats','Go into Taverley Dungeon and use each raw meat on the Cauldron of Thunder. Leave the gate area promptly.','Focused only','Do not AFK in Taverley Dungeon or near animated armour.'],
    ['c05-007','Complete Druidic Ritual','Hand the meats to Sanfew, then speak to Kaqemeex. Herblore unlocks with 250 XP.','Quest'],
    ['c05-008','Put your first lamp into Herblore','Use the saved 300-XP X Marks lamp. If destroyed, reclaim it from Veos.','Essential'],
    ['c05-009','Check potion eligibility','Druidic Ritual now lets you prepare rejuvenation potions at Wintertodt.','Checkpoint']
  ]},
  {id:'06-wintertodt-prep',number:'06',title:'Prepare for Wintertodt',region:'Misthalin / Great Kourend',subtitle:'Warm clothing and 50 Firemaking',goal:'Enter Wintertodt with four warm items and a safe inventory.',steps:[
    ['c06-001','Collect warm jumper and scarf','Ask Gilbert south-east of Barbarian Village about rainbow clothing. If unavailable, choose verified alternatives from OSRS Wiki.','Collect'],
    ['c06-002','Equip four warm items','Use Clue hunter gloves/boots and two other items that the game confirms count as warm clothing.','Essential'],
    ['c06-003','Finish 35 Woodcutting and Firemaking','Chop and burn oaks if either skill needs more XP.','Low attention'],
    ['c06-004','Reach 50 Firemaking','Cut and burn teak logs from level 35 Firemaking, or continue with safe oaks if more convenient.','Low attention'],
    ['c06-005','Optional: early Fletching','Make arrow shafts and work towards 15 Fletching so kindling feels worthwhile.','Optional'],
    ['c06-006','Confirm entry requirements','You need 50 Firemaking. For this route also have four warm items and Herblore unlocked; 20 Construction is recommended.','Checkpoint'],
    ['c06-007','Travel safely to Wintertodt Camp','Reach Great Kourend from Port Sarim or another unlocked method, then navigate north while avoiding aggressive areas.','Travel'],
    ['c06-008','Bank and prepare your inventory','Carry useful tools such as axe, tinderbox, hammer, optional knife, potions/food. Wear warm items.','Preparation'],
    ['c06-009','Join an official mass world','Learn in a populated world before trying solos. Only begin when you can actively monitor warmth.','Focused only','Zero warmth means an unsafe death and loss of Hardcore status.']
  ]},
  {id:'07-firemaking-99',number:'07',title:'99 Firemaking',region:'Wintertodt',subtitle:'Your first Hardcore 99',goal:'Reach 99 Firemaking while keeping the red helmet.',steps:[
    ['c07-001','Learn rejuvenation potion supplies','Collect unfinished potions and bruma herbs at Wintertodt, then make rejuvenation potions.','Preparation'],
    ['c07-002','Complete one practice mass-world round','Light a brazier, feed bruma roots and repair brazier breaks. Watch Wintertodt attack indicators.','Focused only','Learn the damage mechanics before treating Wintertodt as semi-AFK.'],
    ['c07-003','Reach 500 points each round','Aim for reward eligibility; fletch bruma roots to kindling when useful.','Semi-AFK'],
    ['c07-004','Drink potions well before warmth runs low','Rejuvenation potions restore 30% warmth per dose. Leave safely before work calls if needed.','Focused only','At 0% warmth you die instantly and lose Hardcore status.'],
    ['c07-005','Reach 60 Firemaking','Establish a relaxed and safe rotation.','Semi-AFK'],
    ['c07-006','Reach 70 Firemaking','Maintain food and potion supplies, and check warm items.','Semi-AFK'],
    ['c07-007','Reach 80 Firemaking','Decide whether to claim rewards or leave them until other skill levels improve.','Semi-AFK'],
    ['c07-008','Reach 90 Firemaking','Switch to completely safe activities on exceptionally busy workdays.','Semi-AFK'],
    ['c07-009','Reach 95 Firemaking','Stay disciplined — the closer you get, the more costly a careless death feels.','Semi-AFK'],
    ['c07-010','Reach 99 Firemaking','Your first red-helm 99! Buy the cape when affordable.','Milestone'],
    ['c07-011','Review the Reward Cart','Rewards can be stored for later; consider scaling of seeds and herbs at claim time.','Rewards'],
    ['c07-012','Prepare for the next chapter','Next: Ardougne cloak, Fairy Rings, Fossil Island, Farming, Prayer and safe AFK loops.','Next chapter']
  ]}
];
export const planned = [
 {number:'08',title:'Unlocking the world',subtitle:'Ardougne cloak, Fairy Rings and Fossil Island'},
 {number:'09',title:'The AFK engine',subtitle:'Farming, Fishing, Mining and birdhouses'},
 {number:'10',title:'The mid-game',subtitle:'Questing, Prayer and safer combat'},
 {number:'11',title:'2,000 total',subtitle:'Building your 99s'},
 {number:'12',title:'The road to max',subtitle:'All 24 skills including Sailing'}
];
