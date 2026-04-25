# Equipment & Gear

Troopers can be equipped with various armor and weaponry.

All Troopers are, by default, equipped with **Medium Armor**, **Assault Rifles** and plenty of ammo. They can swap out their basic gear, and elect to bring either a Special Weapon or Special Equipment. Gear can be acquired in the field, or through **Requisition**.

**Requisition** measures a Squad's access to rare gear, earned through success and Command's favor. After each Mission, gain 1 Requisition per surviving Trooper; an abstract resource representing commendations, salvage rights, or supply drops.

Spend Requisition between missions to equip Special Weapons, Special Gear, or better Armor. The Squad may pool their points for pricier items, reflecting collective bargaining or pure luck. Costs are listed as `[REQ X]`; items without a cost are freely available.

## Mobility

Each Trooper has a base Mobility of 5. Armor and gear reduce this value. Mobility is the target number for all 
Mobility Checks: roll 1d6 equal or under to succeed. A Trooper with Mobility 0 automatically fails all Mobility Checks. Being wounded imposes -1 Mobility.

| Mobility | Flanking Bonus |
| -------- | -------------- |
| 0-3      | **+1 ATK**     |
| 4        | **+2 ATK**     |
| 5        | **+3 ATK**     |

## Armor

| Armor  | Properties              | Mobility Cost |
| ------ | ----------------------- | ------------- |
| Light  | -1 to final DEF result. | 0             |
| Medium | -                       | -1            |
| Heavy  | +1 to final DEF result. | -2            |

## Weapon Properties

| Weapon         | Properties                                                   |
| -------------- | ------------------------------------------------------------ |
| Carbine        | **+1 ATK** when [[Engaged]] in [[Tight Space]]. **-1 ATK** when [[Engaged]] in [[Open Space]]. |
| Assault Rifle  | No special properties. The reliable workhorse.               |
| Marksman Rifle | **+1 ATK** when [[Engaged]] in [[Exposed Cover]]. **-1 ATK** when [[Engaged]] in [[Dense Cover]]. |

## Special Weapons

A Trooper can carry **1 Special Weapon**. Special Weapons can have passive conditional functions and/or active applications that require [[Ammo]] to use.

### Utility Kit

`REQ: 0 // Mobility: No cost`

Smokes, flares, flashbangs. The essentials. 

Active (1 Ammo each):

- **Smoke.** Pop smoke. The entire Squad gains +1 Mobility this Exchange. The user may also Move.
- **Flashbang.** Tight spaces only. The user gains the ATK benefit of Flanking this Exchange.
- **Flare.** Outdoors only. Signal for an aerial strike, if available. +2 ATK if sky is obstructed (canopy, alleyways), +3 ATK normally, +4 ATK under open sky. All Flanked Troopers must make a [[Mobility Check]] or take an Injury.

### LMG 

`REQ: 1 // Mobility: -1`

Light automatic weapon for mobile suppression and supporting fire.

*Passive:* 

- An additional +1 DEF for a Trooper receiving Covering Fire.

### HMG 

`REQ: 2 // Mobility: -2`

Heavy-caliber weapon best deployed from a braced or fortified position.

*Active:* 

- Provide [[Covering Fire]] for up to 3 Troopers this round. Costs 1 Ammo regardless of number of Troopers covered.

*Passive:* 

- **+1 ATK** when [[Fortified]].

### Sniper Rifle

`REQ: 1 // Mobility: -1`

Long-range rifle optimized for precision shots from cover.

*Passive:* 

- **+1 ATK** when [[Fortified]]. An additional **+1 ATK** when [[Fortified]] and didn't [[Move]] in the previous Exchange.

### Grenade Launcher 

`REQ: 1 // Mobility: -1`

Indirect-fire weapon used to flush enemies or hit hard targets.

*Active:* 

- Launch a grenade against a [[Hard Target]] (counts as a Hit), or at another Trooper's target, granting them the benefit of [[Flanking]] in the next Offense Roll. Multiple grenades can be fired in one attack - each costing 1 Ammo.

### Melee Weapon 

`REQ: 0 // Mobility: -1`

A large maul, chainsaw sword or similar device. Not available in every setting.

*Passive:* 

- When a Trooper Moves Up to a Flanking position, they can choose to move to a Flanked position instead of rolling. Doing so grants +3 ATK. This already includes a bonus for Flanking.

### Rocket Launcher

`REQ: 1 // Mobility: -1`

Anti-armor launcher designed to destroy vehicles and strongpoints.

*Active:* 

- **+3 ATK** - or deal direct damage to a [[Hard Target]], counting as 2 Hits. Single use.

### Plasma Rifle

`REQ: 3 // Mobility: -1`

A devastating energy weapon prone to catastrophic feedback.

*Active:* 

- Roll {roll:1d6|Plasma} on use. Does not require Ammo.

| 1d6 | Result |
| --- | ------ |
| 1   | **Catastrophic Failure.** Trooper suffers +2 Injury, weapon is destroyed. |
| 2–3 | **Dangerous Discharge.** Trooper suffers +1 Injury. +1 ATK. |
| 4–5 | **Stable Discharge.** +2 ATK, or deal 1 Hit to a Hard Target. |
| 6   | **Overcharged Blast.** +3 ATK, or deal 2 Hits to a Hard Target. |

## Special Equipment

A Trooper can carry **1 piece of Special Equipment**.

### Demolition Charges

`REQ: 0 // Mobility: -1`

*Bulky, high-power charges. No use in a fight - but crucial if a mission revolves around destroying critical infrastructure.*

Placing charges can be done once a Sector is cleared, or during an Engagement. If done during an Engagement, Momentum must be GAINING GROUND or greater. The Trooper must commit 2 Exchanges to placing the charges: 1 to move towards a suitable point to place them (acts as Moving Up), 1 to set the charges.

### Jump Pack

`REQ: 2 // Mobility: -1`

*Back-mounted miniature jet engine. Takes quite some time to recharge after use.*

Once per Engagement, the Trooper can instantly shift to an Offensive/Defensive position of choice.

### Drone Gear

`REQ: 0 // Mobility: -1`

*Backpack with a deployable aerial recon drone.*

Add +1 to each [[Advance Roll]]. Does not stack with multiple Drone Gear.

### Medic Gear 

`REQ: 0 // Mobility: -1`

*Bandages, combat stims, splints and sprays.*

Allows the user to patch up [[Wounded]] Troopers back to OK when out of combat.

### Radio Gear

`REQ: 1 // Mobility: -1`

*Bulky backpack-sized transmitter and receiver, allowing one to reach command - even over electrostatic disruptions.*

Call in an artillery strike on the current Sector, once per Mission. Hits in {roll:1d2|Strike ETA} Exchanges from now. When it hits, gain +2 Momentum instantly, with all ground-based Hard Targets being destroyed. All Troopers must make a [[Mobility Check]], gaining {roll:1d3|Injury} Injury on failure.

### Supply Backpack

`REQ: 1 // Mobility: -1`

*Tactical sack stuffed with a variety of ammo, munitions and grenades.*

Holds 6 extra [[Ammo]], which can be redistributed outside of combat.

### Environmental Gear

`REQ: 0 // Mobility: -1`

*Gear for special traversal or dangerous environments, such as climbing gear or hazmat suits. Define what the gear is upon pickup.*

Allows Troopers to withstand dangerous environments or traverse hazardous terrain. One set provides equipment for 2 Troopers.
