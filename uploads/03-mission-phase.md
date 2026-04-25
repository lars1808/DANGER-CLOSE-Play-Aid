# Mission Phase

Upon landing at an LZ the [[Squad]] will start their advance towards their [[Objective]]. When moving between [[Sector|Sectors]], a Squad will be in one of 4 states.

- **Advance** - Moving forward to a new Sector. Leads to an **Engagement** or **Catch Breath**.
- **Engagement** - In a firefight to clear a Sector. Leads to **Retreat** or **Catch Breath**.
- **Retreat** - Falling back to a previous Sector. Leads to an **Engagement** or **Catch Breath**.
- **Catch Breath** - Reload, recover. Leads to a new **Advance**.

## Advance!

The default state - pushing forwards towards the Objective. This can be narrated as encountering and overcoming minor resistance; the Squad moves from cover to cover, returning fire, eliminating scattered foes.

When arriving in a Sector, its contents determine the next step:

| Sector Content | Next Step                                |
| -------------- | ---------------------------------------- |
| Boon           | *Advance!* to the next or *Catch Breath* |
| Nothing        | *Advance!* to the next or *Catch Breath* |
| Threat         | Make an [[Advance Roll]]                 |

## Advance Roll

The **[[Advance Roll]]** determines the starting position of the Squad in an [[Engagement]], or might even skip the Engagement altogether, if the Squad is lucky/well-equipped.

Determine relevant modifiers:

- **Fatigue**. -1 for each 3 Advance Rolls previously made during this mission.
- **Weather/Environmental Conditions**. -1 if bad, -2 if terrible. If the Squad is clearly advantaged by the environment, gain +1. If clearly disadvantaged, -1.
- **Threat Level**. Negative modifier equal to TL.
- **Assault**. Before rolling the Advance Roll, you may spend [[Ammo]] to enhance the roll, at a rate of 2 Ammo for a +1. You cannot [[Infiltration|Infiltrate]]on the same Advance.
- **Stealth**. If the enemy is unaware of any hostile presence in this mission area, gain +3 on the roll. Using Assault or rolling SPOTTED or worse forfeits this bonus for the rest of the mission.

### Momentum & Defensive Positions

Then, roll {roll:2d6|Advance} and apply the modifiers.

| 2d6      | Result       | Momentum           | Defensive Positions |
| -------- | ------------ | ------------------ | ------------------- |
| ≤ 3      | AMBUSHED     | LOSING GROUND      | [[Flanked]]         |
| 4–7      | SPOTTED      | CONTESTED          | [[In Cover]]        |
| 8–10     | SURPRISE     | GAINING GROUND     | [[Fortified]]       |
| 11+      | **Overwhelm** | -                 | -                   |

**Overwhelm.** Due to a mixture of luck, guts, training and teamwork, the Squad manages to absolutely overwhelm the enemy force. No resources are lost, and the enemy is routed. *Catch Breath*.

### Offensive Position & Infiltration

Each Trooper rolls an individual [[Mobility Check]]. If everyone passes their Mobility Check: The Squad bypasses the Sector entirely. No Engagement, no resources spent. Proceed to the next Sector. Narrate how you pass like ghost.

If not everyone passes, first assign individual [[Offensive Position|Offensive Positions]]. Note that the [[Cover]]/[[Space ]]of the Sector might still limit how many Troopers can be [[Fortified]]/[[Flanking]].

| Result   | Mobility Check Success | Mobility Check Failure |
| -------- | ---------------------- | ---------------------- |
| AMBUSHED | [[Engaged]]            | [[Limited]]            |
| SPOTTED  | [[Flanking]]           | [[Engaged]]            |
| SURPRISE | [[Flanking]]           | [[Engaged]]            |

Then, if Stealth is still active, count the number of successful Mobility Checks among your Troopers. For each 2 Successes, pick one of the  following: 

- **Cut Comms**. [[Stealth]] is preserved throughout and after this  Engagement.
- **Target Commanders**. No [[Enemy Tactics]] this Engagement. 
- **Trap**. The first [[Hard Target]] this engagement takes 2 Hits when it  appears. 
- **Exit Route**. [[Disengage]] is automatic, no Injuries.

## Retreat!

Unable to break through, the Squad falls back to their previous Sector. This can occur due to [[Momentum]] reaching DEFEAT, or falling back by choice.

- If the Squad wants to escape, roll {roll:1d6|Pursuit}. On a **4–6**, the enemy pursues. On a **1–3**, the enemy holds position and does not give chase.
- If the Squad chooses to draw the enemy out, pursuit is automatic.

When the enemy pursues, they must split their forces:

| Original TL            | Pursuing TL | Remaining TL |
| ---------------------- | ----------- | ------------ |
| 4 (Overwhelming)       | 3           | 3            |
| 3 (Heavy)              | 2           | 2            |
| 2 (Standard)           | 1           | 1            |
| 1 (Light)              | 1           | 0 (Sector is now empty) |

If the Squad chooses to draw them out, reduce the pursuing TL by 1 (to a minimum of TL 1). *Example:* from a TL 3 force, the enemy pursues with TL 1 and leaves behind TL 2.

Drawing an enemy out into a previous Sector with a high Cover Rating can be quite advantageous - but fleeing from an enemy into a Sector with a low Cover Rating is risky, if the enemy decides to pursue.

## Catch Breath

If a Squad clears a Sector (or finds it empty), they have a chance to catch their breath and regroup. This allows a Trooper to use Medical Gear to bandage the wounded, or Ammo to be redistributed from a Supply Backpack, as well as narrative/roleplaying moments.
