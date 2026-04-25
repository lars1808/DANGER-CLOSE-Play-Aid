# Exchange

During an **[[Exchange]]**:

1. The Troopers determine their **Intent**
2. The Squad makes an **[[Offense Roll]]**
3. Troopers make their **[[Defense Roll|Defense Rolls]]**
4. Impact on [[Momentum]] is resolved
5. Enemies telegraph their **[[Enemy Tactics|Tactics]]**

## Intent

Every Trooper that isn't currently [[Bleeding Out]] or Dead determines their course of action during this Exchange.

Intent describes where a Trooper's **focus** is. Everyone is assumed to be shooting, ducking, reloading and staying alive. A Trooper not Firing may still pick off enemies, but not enough to shift the battle. A Trooper not Moving isn't frozen in place; their tactical position just stays the same.

### ATK & DEF

Throughout these rules, **[[ATK]]** refers to dice (d6’s) added to the Squad's Offense Roll, and **[[DEF]]** to dice added to or subtracted from a Trooper's Defense Roll. The Squad attacks as one: all ATK from every Trooper is pooled into a single dice pool roll that determines whether the Squad gains ground, holds, or gets pushed back. Death, on the other hand, is personal. Each Trooper rolls their own Defense Roll to survive incoming 
fire.

### Fire

Firing is the staple action. Each **[[ATK]]** increases the odds of gaining Momentum. If nobody Fires, the Squad will likely lose ground. Gear (weapons, equipment) modifies ATK in various ways. A Trooper's **Flanking Bonus** is determined by their [[Mobility]]: +1 by default, +2 if Mobility ≥ 4, +3 if Mobility ≥ 5. Being **[[Suppressed]]** prevents a Trooper from firing. If firing at a [[Hard Target]], set those ATK aside - they are tracked and rolled separately.

| Factor                      | Impact     |
| --------------------------- | ---------- |
| Fire                        | 1 ATK      |
| Flanking Bonus              | +1/2/3 ATK |
| Using 1 [[Ammo]]            | +1 ATK     |
| Being Limited               | -1 ATK     |
| Each degree of [[Pressure]] | -1 ATK     |

> Throughout these rules, **ATK** refers to dice (d6s) added to the Squad's Offense Roll, and **DEF** to dice added to or subtracted from a Trooper's Defense Roll. The Squad attacks as one: all ATK from every Trooper is pooled into a single dice pool roll that determines whether the Squad gains ground, holds, or gets pushed back. Death, on the other hand, is personal. Each Trooper rolls their own Defense Roll to survive incoming fire.

### Move

The Trooper repositions on the battlefield. Make a [[Mobility Check]]. [[Grit]] can be used to reroll.

- **Move Up.** Offensive Position becomes **[[Flanking]]**. Mobility Check: Success = [[In Cover]], Failure = [[Flanked]].
- **Fall Back.** Defensive Position becomes **[[Fortified]]**. Mobility Check: Success = [[Engaged]], Failure = [[Limited]].
- **Reposition.** Offensive Position becomes [[Engaged]]. Defensive Position becomes [[In Cover]]. Mobility Check: Success = +1 **ATK** this Exchange (as the Trooper manages to Reposition and fire at the enemy).

> *"Fall back to the depot! We can't hold this!"* Kappa-1 fires a burst over the barrier and runs, keeping low. A round clips the dirt behind him. He hits the doorframe hard, shoulder first, and pulls himself inside. Worse angle, but nothing's getting through these walls.

### Covering Fire

The Trooper adds **+1 [[DEF]]** to a fellow Trooper. Multiple Troopers can provide covering fire to the same Trooper, stacking the bonus.

> *"Keep his head down!"* Lambda-5 rattles off a burst toward the window where the muzzle flash was. He's not trying to hit anyone. He just needs them to flinch long enough for Gamma-2 to make it across the street.

### Use Special Gear

Fire heavy weapons, call in airstrikes, or use other equipment. See [[Special Weapons]] and [[Special Equipment]]. Some gear takes a whole Exchange to use.

### Interact

Do something outside the firefight: stabilize a Trooper who is [[Bleeding Out]], unjam a weapon, plant demo charges. Some Interactions take multiple Exchanges (noted as `Interact[2]`, etc.).

### Disengage

The entire Squad [[Retreat|retreats]] and all Troopers fall back. Each Trooper rolls to see if they take an [[Injury]], depending on current [[Momentum]]. Survivors flee to the previous Sector.

| Momentum        | Injury chance |
| --------------- | ------------- |
| DEFEAT          | 4-in-6        |
| FALTERING       | 3-in-6        |
| LOSING GROUND   | 2-in-6        |
| CONTESTED       | 1-in-6        |

Optionally, one Trooper can decide to lay down their life to protect the others. This Trooper is killed, but all other Troopers flee uninjured.

### Improvise

When a Trooper wants to do something not covered by the other intents, use the [[Oracle Dice|Oracle Die]]. Define the best and worst outcome, set the likelihood, and roll. The Oracle die determines how well it goes, not whether it happens. The Trooper is committed either way.

The cost the Trooper is willing to pay sets the scale of the gain.

- Choosing *Improvise* is already a minor cost: the Trooper isn't Firing.
- Accepting a worse tactical position earns more.
- Taking -DEF earns more still.
- A guaranteed [[Injury]] (no roll needed) earns something substantial.
- A guaranteed death (no roll needed) earns something absolute: the objective is completed, the charges go off, the squad escapes.

The battlefield is not a blank grid. If the fiction says there's a fuel line, a generator, a watchtower, it can be used, destroyed, or turned to advantage. Describe what the Squad sees. Then let that description give you ideas.

## Offense Roll

Pool all ATK from the Squad and roll that many d6s. Take the highest value.

- Add **+1 ATK** if Momentum was gained last Exchange.
- Add **+1 ATK** if a Trooper died last Exchange.
- Subtract -**ATK** equal to the current **[[Pressure]]**.
- If the pool is 0 ATK, roll {roll:2d6kl1|0 ATK pool} and take the lowest. Success at a Cost is not available at 0 ATK.

| Offense Roll Result | Outcome |
| ------------------- | ------- |
| ≤ 3                 | **Pushed Back** |
| 4–5                 | **Hold Position** OR **Success at a Cost** |
| 6                   | **Success** |

### Pushed Back

Lose -1 Momentum. If Momentum reaches DEFEAT, the Squad is routed, as per the Disengage intent.

### Hold Position

Each Trooper gains +1 DEF this Exchange. No Momentum change.

### Success at a Cost

Gain +1 Momentum. -1 DEF for the most at-risk Trooper (most injured in the worst Defensive Position). If this applies to multiple Troopers, pick one at random. This Trooper also takes +1 [[Injury]] if hit. If this Momentum gain pushes Momentum to VICTORY, make one final Defense Roll for all Troopers, in which it's not possible to go [[Suppressed]].

### Success

Gain +1 Momentum. If you roll a number of 6s ≥ [[Threat Level]] + 1, gain 1 additional Momentum (so never more than +2 Momentum per Exchange). If this Momentum gain pushes Momentum to VICTORY, the Engagement is won. If you obtain a Success you can also opt to **Hold Position** instead, as that might be beneficial during defense or extraction missions. 

If after the Offense Roll, Momentum is not at DEFEAT or VICTORY, the fight continues. The other effects of Momentum gain/loss are resolved after the Defense Roll.

## Defense Roll

Each Trooper rolls individually to resist incoming attacks. Each Trooper has **1 DEF** by default.

- **Beneficial situations**, such as [[Covering Fire]], can add +1 DEF or more.
- **Risky situations** can subtract -1 DEF or more. These will be noted in the specific rules that apply them.

Tally up a Trooper's total DEF.

- If the total is **1 or higher**, roll that many d6 and take the highest (3 DEF = 3d6, take highest).
- If the total is **0 or less**, roll **1 + the negative value** d6s and keep the lowest. At 0 DEF, that means 'roll 2d6 and keep the lowest'. At -1 DEF, it means '3d6 and keep the lowest', and so on.

Spend 1 [[Grit]] to reroll 1d6. You must take the new result.

**[[Armor]]** modifies the final result: Heavy Armor adds +1, Light Armor subtracts -1. For example, a Trooper In Cover with Heavy Armor who rolls a 2 treats it as a 3, avoiding injury.

A Trooper takes **Direct Fire** if their final result is equal to or below the following:

| Defense Roll Result | Flanked      | In Cover     | Fortified    |
| ------------------- | ------------ | ------------ | ------------ |
| 1                   | Direct Fire  | Direct Fire  | Direct Fire  |
| 2                   | Direct Fire  | Direct Fire  | Safe         |
| 3                   | Direct Fire  | Safe         | Safe         |
| 4–6                 | Safe         | Safe         | Safe         |

### Direct Fire

The Defense Roll failed, bullets (or an equivalent) are hitting closer and closer. The Trooper has one final choice to make:

- Suffer an [[Injury]]
- Hit the ground - and become **Suppressed**

### Injury

A Trooper's [[Status]] is either OK, Grazed, Wounded, Bleeding Out or Dead. This works as a 'track'; 1 Injury when OK moves the Status to Grazed, taking 2 Injuries when Grazed moves the Trooper to Bleeding Out.

The severity of Injury suffered depends on the Threat Level:

| Threat Level     | Injury       |
| ---------------- | ------------ |
| 1 - Light        | 1 Injury     |
| 2 - Standard     | {roll:1d2} Injuries |
| 3 - Heavy        | {roll:1d3} Injuries |
| 4 - Overwhelming | {roll:1d4} Injuries |

| Status       | Notes                                                        |
| ------------ | ------------------------------------------------------------ |
| OK           | All good                                                     |
| Grazed       | Restored to OK when Catching Breath                          |
| Wounded      | Can only be healed through medical attention. -1 Mobility.   |
| Bleeding Out | Dies at the end of next Exchange unless stabilized. Cannot take actions. |
| Dead         | KIA                                                          |

### Suppressed

A Trooper that fails their Defense Roll can choose to become **Suppressed**. They avoid Injury entirely, but cannot Fire (or use similar offensive Gear) or provide Covering Fire in the next Exchange. Choose this before the severity of Injury is rolled for.

- A Suppressed Trooper remains Suppressed until they pass a [[Defense Roll]] or become [[Fortified]].
- Being or becoming Fortified clears Suppressed, but only after the Exchange's Offense Roll. The Trooper still loses their ability to Fire for one Exchange.
- A Suppressed Trooper cannot choose to become Suppressed again - a second failed Defense Roll causes Injury.

## Momentum Gain & Loss

At the end of the Exchange, see if the squad lost or gained Momentum.

### Momentum Gain

- Gain +1 ATK on the next Offensive Roll.
- Any Troopers that were [[Flanking]] can either choose to become [[Engaged]] (as the enemy falls back/there's no flanked enemies left to attack) or to remain [[Flanking]] (pursuing the enemy), but with -1 DEF the next Exchange.
- Any Troopers that were [[Fortified]] can either choose to become [[Limited]] (safe, but with no immediate enemies to shoot) or [[Engaged]] + [[In Cover]] (moving up to press the advantage).

### Momentum Loss

On Momentum Loss, any Flanked Troopers must **Fall Back** in the next Exchange, or suffer -1 DEF during that round.

## Enemy Tactics

When fighting serious threats, the enemy will prepare for certain strategies at the end of an Exchange. The Troopers can see these coming, and can prepare accordingly. Roll {roll:1d6} + Threat Level to see which Tactic is triggered. Your Squad’s Sergeant, if not Bleeding Out or Suppressed, can nullify a Tactic at the cost of 1 Grit.

| 1d6 + TL | Tactic       |
| -------- | ------------ |
| 2-4      | None         |
| 5        | Reposition   |
| 6        | Scatter      |
| 7        | Pinned Down  |
| 8        | Encircle     |
| 9        | Push Forward |
| 10       | Fall Back    |

- **Reposition**. A random [[Flanking]] Trooper becomes [[Engaged]]. *An enemy maneuver hinders line-of-sight.* 
- **Scatter**. A random Trooper must Move next Exchange or take +1 [[Injury]]. *A grenade lands at someone’s feet.*
- **Pinned Down**. **-2 ATK** on the next [[Offense Roll]]. *A hail of fire keeps everyone’s head down.*
- **Encircle**. All [[Fortified]] Troopers are now [[In Cover]]. *Encroaching enemies endanger even careful Troopers.*
- **Push Forward**. All Troopers reduce [[Defensive Position]] by 1 step. *The enemy rallies in a brutal rush.*
- **Fall Back**. All Troopers reduce [[Offensive Position]] by 1 step. *The enemy solidifies their position, and the Squad is left without good angles.*

### Pressure

As an Engagement drags on, the enemy adapts and reinforces. This accumulated weight of fire is tracked as **Pressure**. At the end of each Exchange, when rolling for Enemy Tactics, if the d6 shows a natural 4 or higher, Pressure increases by 1 (to a maximum of TL+1). This is in addition to any Tactic triggered by the total roll.

- Each point of Pressure imposes **-1 ATK** on the Squad.
- Pressure reduces the Squad's total **ATK** pool before dice are allocated to targets.
- Pressure can be targeted during Fire as a [[Hard Target]]. Each Hit reduces Pressure by 1.
- Pressure resets between Engagements.
- The Sergeant's Grit-spend to nullify a Tactic does not prevent a Pressure increase.
- Reaching VICTORY routs the enemy and clears Pressure along with them.

## The End of the Engagement

The steps that make up an Exchange (Intent, Offense Roll, Defense Roll, Momentum Gain & Loss, Enemy Tactics) are repeated until essentially one of 4 things happen:

- The Squad reaches **VICTORY**, catches their breath, and moves on to the next Sector (returning to the [[Advance]])
- The Squad reaches **DEFEAT**, and is forced to retreat. Use the Disengage intent, and the *Retreat!* section in the Mission Phase.
- The Squad chooses to disengage, and chooses to retreat. Use the Disengage intent, and the *Retreat!* section in the Mission Phase.
- The Squad is entirely wiped out.

## After-Action Report

The fighting's over for now. Before you move on, take a moment to look at what just happened.

Not the numbers, the events. An Engagement is a few minutes of chaos compressed into dice rolls and decisions. These questions help you decompress it back into a scene.

You don't need to write anything down. Just think about it. If something sticks, make a note. These details add up over time.

- Which Trooper took the biggest risk, and did it pay off?
- What moment would the squad still be talking about an hour later?
- Did anyone's reputation change in the last few minutes?

These notes will help you with the Field Report later.
