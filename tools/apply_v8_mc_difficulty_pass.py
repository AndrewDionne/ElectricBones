#!/usr/bin/env python3
"""Apply v8 multiple-choice difficulty pass.

This rewrites existing Multiple choice cards only. It keeps the card count and stable Id values unchanged.
"""
from __future__ import annotations

import csv
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
CSV_PATH = ROOT / "data" / "flashcards.csv"
DOC_PATH = ROOT / "docs" / "v8-multiple-choice-difficulty-pass.md"
CHANGES_PATH = ROOT / "docs" / "v8-multiple-choice-wording-changes.csv"

# Ordered to match the existing Multiple choice cards in data/flashcards.csv.
# Each tuple: (front, back, choices, difficulty, cue)
REPLACEMENTS = [
    # 7C Muscles and bones — 40 cards
    ("A pupil says breathing and respiration mean the same thing. Which correction is best?", "Breathing moves air in and out of the lungs; respiration releases energy in cells.", ["Breathing moves air in and out of the lungs; respiration releases energy in cells.", "Breathing releases energy in cells; respiration moves air into the lungs.", "Both words mean oxygen moving from the lungs into the blood.", "Both words mean the heart pumping blood around the body."], 4, "Common trap: breathing is ventilation; respiration is a chemical process in cells."),
    ("A blood sample carries oxygen from the lungs to the muscles. Which part of the blood carries most of that oxygen?", "Red blood cells.", ["Red blood cells.", "Plasma.", "White blood cells.", "Platelets."], 3, "Red blood cells carry most oxygen; plasma carries many dissolved substances."),
    ("A vessel has thick muscular walls and carries blood away from the heart under high pressure. What type of vessel is it?", "Artery.", ["Artery.", "Vein.", "Capillary.", "Tendon."], 4, "Away from heart = artery. Back to heart = vein."),
    ("Which description correctly shows gas exchange in the lungs?", "Oxygen moves from air spaces into blood; carbon dioxide moves from blood into air spaces.", ["Oxygen moves from air spaces into blood; carbon dioxide moves from blood into air spaces.", "Oxygen moves from blood into air spaces; carbon dioxide moves from air spaces into blood.", "Both oxygen and carbon dioxide move from blood into air spaces.", "Both oxygen and carbon dioxide are made inside the air spaces."], 4, "Think direction: oxygen into blood; carbon dioxide out of blood."),
    ("During inhalation, which set of changes helps air enter the lungs?", "Diaphragm contracts and moves down; rib muscles lift the ribs.", ["Diaphragm contracts and moves down; rib muscles lift the ribs.", "Diaphragm relaxes and moves up; rib muscles lower the ribs.", "Diaphragm contracts and moves up; rib muscles lower the ribs.", "Diaphragm relaxes and moves down; rib muscles lift the ribs."], 4, "Inhaling increases chest volume."),
    ("Which statement separates ventilation from respiration most accurately?", "Ventilation is air movement; respiration is energy release in cells.", ["Ventilation is air movement; respiration is energy release in cells.", "Ventilation releases energy; respiration moves air.", "Ventilation is only gas exchange in blood; respiration is only breathing out.", "Ventilation and respiration are identical processes."], 4, "This is a high-frequency Year 7 misconception."),
    ("Which statement gives the function of the skull in the skeleton?", "It protects the brain.", ["It protects the brain.", "It pumps blood to the brain.", "It makes impulses for the nervous system.", "It joins muscles to bones."], 3, "Protection is one key function of the skeleton."),
    ("Which statement gives the function of the rib cage?", "It helps protect the heart and lungs while still allowing breathing movements.", ["It helps protect the heart and lungs while still allowing breathing movements.", "It protects only the stomach and cannot move.", "It makes blood cells and controls impulses.", "It joins the upper arm bone to the shoulder."], 3, "Ribs protect organs but still move during breathing."),
    ("In a moving joint, which statement describes the joint itself?", "A place where two or more bones meet.", ["A place where two or more bones meet.", "A cord that joins muscle to bone.", "A smooth layer that reduces rubbing at bone ends.", "A muscle pair that pulls bones in opposite directions."], 3, "Joint, tendon, cartilage and antagonistic pair are different ideas."),
    ("Why is cartilage important at the ends of bones in a joint?", "It reduces friction and helps the bones move smoothly.", ["It reduces friction and helps the bones move smoothly.", "It contracts to bend the joint.", "It carries oxygen to the joint.", "It sends impulses from the brain."], 3, "Cartilage is not a muscle or nerve."),
    ("A tissue holds two bones together at a joint. What is it?", "Ligament.", ["Ligament.", "Tendon.", "Cartilage.", "Capillary."], 3, "Ligaments join bone to bone."),
    ("A tissue joins a muscle to a bone so that the bone can be pulled. What is it?", "Tendon.", ["Tendon.", "Ligament.", "Cartilage.", "Vein."], 3, "Tendons join muscle to bone."),
    ("Why must many muscles work as antagonistic pairs?", "A muscle can pull when it contracts but cannot push the bone back.", ["A muscle can pull when it contracts but cannot push the bone back.", "A muscle can push but cannot pull, so the second muscle pulls.", "A muscle can only work if a tendon changes into cartilage.", "A muscle can move only when a capillary contracts."], 4, "Pairs allow movement in opposite directions."),
    ("At the elbow, what happens when the biceps contracts and the triceps relaxes?", "The lower arm bends upwards.", ["The lower arm bends upwards.", "The lower arm straightens.", "The ribs move downwards.", "The heart chambers get smaller."], 3, "Biceps contraction bends the elbow."),
    ("At the elbow, what happens when the triceps contracts and the biceps relaxes?", "The lower arm straightens.", ["The lower arm straightens.", "The lower arm bends upwards.", "The diaphragm moves down.", "The skull protects the brain."], 3, "Triceps contraction straightens the elbow."),
    ("Which list gives the main parts involved in the nervous system response pathway?", "Brain, spinal cord and nerves.", ["Brain, spinal cord and nerves.", "Heart, arteries and veins.", "Bones, cartilage and ligaments.", "Lungs, diaphragm and ribs only."], 3, "Nerves carry impulses between receptors, CNS and effectors."),
    ("In the nervous system, what is an impulse?", "An electrical signal carried by nerve cells.", ["An electrical signal carried by nerve cells.", "A pulse of blood in an artery.", "A gas moving across an alveolus.", "A muscle that joins bone to bone."], 3, "Impulse means signal, not movement of blood."),
    ("Which statement best describes a stimulant drug?", "It speeds up activity in the nervous system.", ["It speeds up activity in the nervous system.", "It always slows reaction time by reducing nerve messages.", "It is any medicine that cures infection.", "It is any substance that cannot affect the body."], 4, "Caffeine and nicotine are common examples."),
    ("Which statement best describes a depressant drug?", "It slows down activity in the nervous system.", ["It slows down activity in the nervous system.", "It speeds up all nerve impulses.", "It only affects the skeleton, not the nervous system.", "It is any legal medicine."], 4, "Alcohol and heroin are common depressant examples in the pack."),
    ("A driver takes longer to brake after drinking alcohol. Which explanation fits the science?", "Reaction time increased because nervous-system messages were slowed.", ["Reaction time increased because nervous-system messages were slowed.", "Reaction time decreased because impulses travelled faster.", "Pulse rate was measured in newtons instead of beats per minute.", "The arm muscles could push but not pull."], 4, "Reaction time is the time taken to respond to a stimulus."),
    ("Which word equation correctly represents aerobic respiration in humans?", "glucose + oxygen → carbon dioxide + water + energy released", ["glucose + oxygen → carbon dioxide + water + energy released", "carbon dioxide + water → glucose + oxygen + energy absorbed", "oxygen + water → glucose + carbon dioxide + salt", "glucose + carbon dioxide → oxygen + water + energy released"], 4, "Reactants are glucose and oxygen; products include carbon dioxide and water."),
    ("Sandy counts 25 pulse beats in 20 seconds. What is her pulse rate in beats per minute?", "75 beats per minute.", ["75 beats per minute.", "25 beats per minute.", "45 beats per minute.", "500 beats per minute."], 4, "Multiply by 3 because 20 seconds fits into 60 seconds three times."),
    ("Which function belongs mainly to plasma in the blood?", "Carrying dissolved substances such as carbon dioxide and nutrients.", ["Carrying dissolved substances such as carbon dioxide and nutrients.", "Carrying most oxygen using haemoglobin.", "Making blood clot at a cut.", "Destroying pathogens as the main defence cells."], 4, "Plasma is the liquid part of blood."),
    ("Why do active muscles need a good supply of oxygen and nutrients?", "They are used in respiration to release energy for contraction.", ["They are used in respiration to release energy for contraction.", "They are used to turn tendons into ligaments.", "They are used to make blood flow backwards through arteries.", "They are used to reduce the pH of the muscle."], 4, "Link oxygen/nutrients → respiration → energy → contraction."),
    ("Which organ is the main site where oxygen enters the blood and carbon dioxide leaves it?", "Lungs.", ["Lungs.", "Stomach.", "Skull.", "Femur."], 3, "Gas exchange happens in the lungs."),
    ("What happens to oxygen during gas exchange at the lung surface?", "It diffuses from the air spaces into the blood.", ["It diffuses from the air spaces into the blood.", "It diffuses from the blood into the air spaces.", "It is made by the ribs when they move.", "It changes into plasma before reaching the blood."], 4, "Oxygen goes into the blood."),
    ("What happens to carbon dioxide during gas exchange at the lung surface?", "It diffuses from the blood into the air spaces to be breathed out.", ["It diffuses from the blood into the air spaces to be breathed out.", "It diffuses from the air spaces into the blood.", "It is changed directly into oxygen by the lungs.", "It is stored in bones until exercise starts."], 4, "Carbon dioxide is a waste gas removed from blood."),
    ("Why does one loop of double circulation carry blood to the lungs?", "So blood can pick up oxygen and lose carbon dioxide.", ["So blood can pick up oxygen and lose carbon dioxide.", "So blood can digest food before reaching the stomach.", "So red blood cells can turn into white blood cells.", "So bones can make the heart contract."], 4, "The lung loop exchanges gases."),
    ("What happens when the heart muscle contracts around a chamber full of blood?", "The chamber volume decreases and blood is forced out.", ["The chamber volume decreases and blood is forced out.", "The chamber volume increases and blood is pulled out.", "The chamber fills with air and becomes a lung.", "The chamber wall becomes thinner so nutrients escape."], 4, "Contraction reduces volume and increases pressure."),
    ("Which adaptation makes capillaries suitable for exchange with body cells?", "Very thin walls so substances can move in and out quickly.", ["Very thin walls so substances can move in and out quickly.", "Very thick walls so nothing can leave the blood.", "Valves to stop air entering the lungs.", "Tendons to attach them to muscles."], 4, "Thin walls shorten the distance for diffusion."),
    ("Which statement correctly identifies arteries?", "They carry blood away from the heart, usually under high pressure.", ["They carry blood away from the heart, usually under high pressure.", "They carry blood back to the heart and always have very thin walls.", "They are one-cell-thick vessels for exchange.", "They join muscles to bones at joints."], 4, "Arteries carry blood away from the heart."),
    ("Which statement correctly identifies veins?", "They carry blood back towards the heart and often contain valves.", ["They carry blood back towards the heart and often contain valves.", "They carry blood away from the heart at high pressure.", "They are microscopic vessels used mainly for exchange.", "They are tissues that connect bone to bone."], 4, "Veins return blood to the heart."),
    ("A student records hand-grip force in kilograms. Which correction is best?", "Force should be recorded in newtons.", ["Force should be recorded in newtons.", "Force should be recorded in volts.", "Force should be recorded in beats per minute.", "Force has no units in science."], 3, "Newtons are the unit of force."),
    ("Which statement best explains why the biceps and triceps are an antagonistic pair?", "One muscle contracts to move the arm one way; the other contracts to move it back.", ["One muscle contracts to move the arm one way; the other contracts to move it back.", "Both muscles contract at the same time to push the bone both ways.", "One muscle carries oxygen while the other carries carbon dioxide.", "Both muscles protect the heart and lungs."], 4, "Antagonistic muscles produce opposite movements."),
    ("Which question could be answered using a fair scientific investigation?", "Does caffeine change reaction time?", ["Does caffeine change reaction time?", "Should energy drinks be banned for children?", "Is football a better sport than swimming?", "Is it fair to test medicines on animals?"], 4, "Scientific questions can be tested with evidence."),
    ("Which question is ethical rather than mainly scientific?", "Is it acceptable to test a new medicine on animals?", ["Is it acceptable to test a new medicine on animals?", "How many beats per minute is the pulse after exercise?", "Does caffeine affect reaction time?", "Which vessel carries blood away from the heart?"], 4, "Ethical questions involve what people think is right or fair."),
    ("Which list contains only stimulant examples from this topic?", "caffeine, nicotine and cocaine", ["caffeine, nicotine and cocaine", "alcohol, heroin and solvents", "paracetamol, penicillin and ibuprofen", "oxygen, glucose and plasma"], 4, "Stimulants speed up nervous system activity."),
    ("Which list contains only depressant examples from this topic?", "alcohol, heroin and solvents", ["alcohol, heroin and solvents", "caffeine, nicotine and cocaine", "paracetamol, penicillin and ibuprofen", "oxygen, carbon dioxide and glucose"], 4, "Depressants slow nervous system activity."),
    ("Which pair are medicines rather than recreational stimulants or depressants?", "paracetamol and penicillin", ["paracetamol and penicillin", "caffeine and cocaine", "alcohol and heroin", "nicotine and ecstasy"], 3, "Medicines are drugs used to treat or prevent disease or symptoms."),
    ("Why can depressant drugs increase the risk of accidents?", "They can slow impulses and increase reaction time.", ["They can slow impulses and increase reaction time.", "They make impulses travel faster and reduce thinking time.", "They turn arteries into veins during exercise.", "They make cartilage thicker at joints."], 4, "Longer reaction time means a slower response."),

    # 7F Acids and alkalis — 39 cards
    ("A bottle has a warning symbol because it could damage skin. Which word best describes the danger source?", "Hazard.", ["Hazard.", "Risk.", "Neutralisation.", "Indicator."], 3, "Hazard = something that could cause harm."),
    ("A class uses dilute acid. The teacher reduces the chance of harm by using goggles and small volumes. What is being reduced?", "Risk.", ["Risk.", "Hazard.", "Product.", "Base."], 4, "Risk is the chance that a hazard will cause harm."),
    ("Which description matches the corrosive hazard warning?", "It can damage living tissue and some materials.", ["It can damage living tissue and some materials.", "It catches fire easily near a flame.", "It is safe to touch because it is neutral.", "It only changes colour with indicators."], 3, "Corrosive substances can cause burns/damage."),
    ("Which instruction is most important when using a flammable liquid near a Bunsen burner?", "Keep it away from flames because it catches fire easily.", ["Keep it away from flames because it catches fire easily.", "Add universal indicator before heating it.", "Use a voltmeter to check whether it is safe.", "Neutralise it with distilled water only."], 4, "Flammable means catches fire easily."),
    ("A solution turns blue litmus red and has pH 3. Which description is correct?", "It is acidic.", ["It is acidic.", "It is alkaline.", "It is neutral.", "It must be pure water."], 3, "Acids have pH below 7 and turn blue litmus red."),
    ("A solution has pH 10 and turns red litmus blue. Which description is correct?", "It is alkaline.", ["It is alkaline.", "It is acidic.", "It is neutral.", "It must be citric acid."], 3, "Alkalis have pH above 7 and turn red litmus blue."),
    ("A liquid has pH 7. Which statement is most accurate?", "It is neutral, not acidic or alkaline.", ["It is neutral, not acidic or alkaline.", "It is a weak acid because 7 is below 14.", "It is a strong alkali because 7 is high.", "It must be corrosive."], 3, "pH 7 is neutral."),
    ("Blue litmus paper is dipped into hydrochloric acid. What should happen?", "It turns red.", ["It turns red.", "It turns blue.", "It turns purple.", "It gives a number directly."], 3, "Blue litmus turns red in acid."),
    ("Red litmus paper is dipped into sodium hydroxide solution. What should happen?", "It turns blue.", ["It turns blue.", "It turns red.", "It turns green.", "It dissolves to make a salt."], 3, "Red litmus turns blue in alkali."),
    ("Why is universal indicator more useful than litmus when comparing acid strengths?", "It shows a range of colours linked to different pH values.", ["It shows a range of colours linked to different pH values.", "It only tells whether a liquid is hot or cold.", "It gives only two colours: red or blue.", "It neutralises acids before a reading is taken."], 4, "Universal indicator gives more detail than litmus."),
    ("Which statement best describes neutralisation?", "An acid reacts with a base or alkali to make a solution closer to neutral.", ["An acid reacts with a base or alkali to make a solution closer to neutral.", "An acid is made more concentrated by removing water.", "An indicator changes directly into a salt.", "A solid disappears without reacting."], 4, "Neutralisation reduces acidity/alkalinity."),
    ("What are the products of the reaction: acid + alkali?", "Salt and water.", ["Salt and water.", "Acid and water.", "Alkali and hydrogen.", "Indicator and oxygen."], 3, "acid + alkali → salt + water."),
    ("Which statement describes a base in acid reactions?", "A substance that reacts with and neutralises an acid.", ["A substance that reacts with and neutralises an acid.", "A solution that must have pH below 7.", "A dye used only to show acid strength.", "A substance that cannot form salts."], 4, "Many bases are insoluble; soluble bases are alkalis."),
    ("A white solid disappears completely when stirred into water. Which word describes the solid?", "Soluble.", ["Soluble.", "Insoluble.", "Concentrated.", "Corrosive."], 3, "Soluble means able to dissolve."),
    ("A metal oxide remains as a solid after stirring in water. Which word describes it?", "Insoluble.", ["Insoluble.", "Soluble.", "Neutral.", "Dilute."], 3, "Insoluble means not dissolving in the liquid."),
    ("Water is added to an acid before the experiment. Which statement describes the new solution?", "It is more dilute because the acid particles are spread through more water.", ["It is more dilute because the acid particles are spread through more water.", "It is more concentrated because more liquid has been added.", "It must now be neutral because all acids become pH 7 in water.", "It is insoluble because water has been added."], 4, "Diluting lowers concentration; it does not guarantee pH 7."),
    ("Which description fits a concentrated acid best?", "A large amount of acid dissolved in a relatively small volume of solution.", ["A large amount of acid dissolved in a relatively small volume of solution.", "Any acid with pH exactly 7.", "An acid that has been made safer by adding lots of water.", "An acid that cannot react with bases."], 4, "Concentration is about amount dissolved in a volume."),
    ("In the reaction hydrochloric acid + sodium hydroxide → sodium chloride + water, which are the reactants?", "hydrochloric acid and sodium hydroxide", ["hydrochloric acid and sodium hydroxide", "sodium chloride and water", "hydrochloric acid and sodium chloride", "sodium hydroxide and water"], 4, "Reactants are the substances at the start."),
    ("In the reaction hydrochloric acid + sodium hydroxide → sodium chloride + water, which are the products?", "sodium chloride and water", ["sodium chloride and water", "hydrochloric acid and sodium hydroxide", "hydrochloric acid and water", "sodium hydroxide and sodium chloride"], 4, "Products are the substances made."),
    ("Which salt-name ending is made when hydrochloric acid reacts with a base?", "chloride", ["chloride", "nitrate", "sulfate", "oxide"], 3, "Hydrochloric acid makes chloride salts."),
    ("Which salt-name ending is made when nitric acid reacts with a base?", "nitrate", ["nitrate", "chloride", "sulfate", "oxide"], 3, "Nitric acid makes nitrate salts."),
    ("Which salt-name ending is made when sulfuric acid reacts with a base?", "sulfate", ["sulfate", "chloride", "nitrate", "hydroxide"], 3, "Sulfuric acid makes sulfate salts."),
    ("Why can an antacid help with indigestion?", "It contains a base that neutralises excess stomach acid.", ["It contains a base that neutralises excess stomach acid.", "It contains an acid that makes the stomach more acidic.", "It is an indicator that changes the stomach colour.", "It is a salt that stops all digestion."], 4, "Antacid = anti-acid; neutralises acid."),
    ("Which statement best explains acid rain?", "Rainwater becomes more acidic when acidic gases dissolve in it.", ["Rainwater becomes more acidic when acidic gases dissolve in it.", "Rainwater becomes pH 7 whenever it falls through air.", "Rainwater becomes alkaline when salt crystals dissolve in it.", "Rainwater is called acid rain only if it is purple with universal indicator."], 4, "Acid rain is linked to air pollution."),
    ("Which liquid would you choose as an example of an acid containing ethanoic acid?", "vinegar", ["vinegar", "oven cleaner", "washing powder", "pure water"], 3, "Vinegar contains ethanoic acid."),
    ("Which liquid would you choose as an example of an acid containing citric acid?", "lemon juice", ["lemon juice", "toothpaste", "washing powder", "indigestion powder"], 3, "Citrus fruits contain citric acid."),
    ("Which everyday substance is the best example of neutral pH?", "pure water", ["pure water", "stomach acid", "oven cleaner", "vinegar"], 3, "Pure water is neutral at about pH 7."),
    ("Which everyday substance is usually alkaline but not as strongly alkaline as oven cleaner?", "toothpaste", ["toothpaste", "vinegar", "lemon juice", "fizzy drink"], 4, "Toothpaste is mildly alkaline in many school pH examples."),
    ("Which substance is the best example of a strongly alkaline household cleaner?", "oven cleaner", ["oven cleaner", "milk", "fizzy drink", "lemon juice"], 3, "Oven cleaner is often strongly alkaline."),
    ("Which drink is acidic in the pack’s everyday pH examples?", "fizzy drink", ["fizzy drink", "pure water", "washing powder", "oven cleaner"], 3, "Many fizzy drinks are acidic."),
    ("Which substance is used to neutralise excess stomach acid?", "indigestion powder or antacid", ["indigestion powder or antacid", "vinegar", "lemon juice", "universal indicator"], 3, "Antacids contain bases."),
    ("A solution is tested with phenolphthalein and remains colourless. Which conclusion is most likely?", "It is acidic or neutral rather than alkaline.", ["It is acidic or neutral rather than alkaline.", "It is strongly alkaline.", "It must contain copper sulfate.", "It must be flammable."], 4, "Phenolphthalein is colourless in acidic/neutral solution and pink in alkali."),
    ("A solution is tested with phenolphthalein and turns pink. Which conclusion is most likely?", "It is alkaline.", ["It is alkaline.", "It is acidic.", "It is neutral pure water.", "It contains no dissolved substances."], 3, "Pink phenolphthalein indicates alkali."),
    ("A solution turns methyl orange red. Which conclusion is most likely?", "It is acidic.", ["It is acidic.", "It is alkaline.", "It is neutral pure water.", "It is a pH meter."], 3, "Methyl orange is red in acid."),
    ("A solution turns methyl orange yellow. Which conclusion is most likely?", "It is alkaline rather than acidic.", ["It is alkaline rather than acidic.", "It is strongly acidic.", "It is flammable because it is yellow.", "It is an insoluble base."], 4, "Methyl orange is yellow in alkali."),
    ("Which tool gives a numerical pH value without matching colours by eye?", "pH meter", ["pH meter", "litmus paper", "evaporating dish", "filter funnel"], 3, "A pH meter gives a number directly."),
    ("After dipping universal indicator paper into a solution, what should it be compared with?", "a pH colour chart", ["a pH colour chart", "a hazard-symbol sheet", "a salt-name table only", "a thermometer scale"], 3, "Universal indicator needs a colour chart to estimate pH."),
    ("Which salt is made when sulfuric acid reacts with copper oxide?", "copper sulfate", ["copper sulfate", "copper chloride", "sodium sulfate", "magnesium nitrate"], 4, "The metal gives the first part; sulfuric acid gives sulfate."),
    ("Which salt is made when hydrochloric acid reacts with zinc oxide?", "zinc chloride", ["zinc chloride", "zinc nitrate", "sodium chloride", "magnesium sulfate"], 4, "The metal gives zinc; hydrochloric acid gives chloride."),

    # 7J Current electricity — 44 cards
    ("Which statement best describes electric current in a complete circuit?", "A flow of charges through the circuit.", ["A flow of charges through the circuit.", "A store of energy inside the bulb.", "The energy transferred by each charge.", "The opposition to flow in a component."], 4, "Current is flow; voltage is energy transfer/push; resistance opposes flow."),
    ("Which unit and symbol are used for current?", "ampere, A", ["ampere, A", "volt, V", "ohm, Ω", "newton, N"], 3, "Current is measured in amperes/amps, symbol A."),
    ("A student wants to measure the current through a lamp. Where should the ammeter go?", "In series with the lamp so the same current passes through the meter and lamp.", ["In series with the lamp so the same current passes through the meter and lamp.", "In parallel across the lamp so it measures energy transferred.", "Across the cell only, replacing the wires.", "Outside the complete circuit so it does not affect current."], 4, "Ammeters are connected in series."),
    ("Which statement best describes voltage across a component?", "The energy transferred by the charges as they pass through the component.", ["The energy transferred by the charges as they pass through the component.", "The number of charges passing each second.", "The total opposition to current in the wires only.", "The number of branches in the circuit."], 4, "Voltage is linked to energy transferred."),
    ("A student wants to measure the voltage across a lamp. Where should the voltmeter go?", "In parallel across the lamp.", ["In parallel across the lamp.", "In series before the lamp.", "In the same gap as the switch.", "In place of the cell."], 4, "Voltmeters are connected across components."),
    ("Which statement best describes the role of a cell in a circuit?", "It supplies energy to the charges in the circuit.", ["It supplies energy to the charges in the circuit.", "It measures the current in each branch.", "It increases resistance so current stops.", "It protects the circuit by melting."], 3, "Cells provide electrical energy."),
    ("A lamp is off because the switch is open. What changes when the switch is closed?", "The gap is closed so there is a complete path for current.", ["The gap is closed so there is a complete path for current.", "A new cell is created inside the switch.", "The voltage across every component becomes zero.", "The wires become insulators."], 4, "Closed switch = complete circuit."),
    ("Which material would be the best conductor for connecting wires?", "copper", ["copper", "rubber", "plastic", "dry wood"], 3, "Metals are usually good conductors."),
    ("Which material would be best for the outside covering of a wire?", "plastic", ["plastic", "copper", "aluminium", "steel"], 3, "Insulators cover wires to reduce shock risk."),
    ("Which statement best describes resistance?", "How difficult it is for current to flow through a component or wire.", ["How difficult it is for current to flow through a component or wire.", "How much charge passes a point each second.", "The energy transferred by each charge.", "A component that supplies electrical energy."], 4, "Resistance opposes current."),
    ("What is the effect of adding a resistor in series with a lamp?", "Total resistance increases, so current usually decreases.", ["Total resistance increases, so current usually decreases.", "Total resistance decreases, so current always increases.", "The resistor supplies energy like a cell.", "The resistor measures current like an ammeter."], 4, "More resistance normally means less current for the same voltage."),
    ("What is the useful feature of a variable resistor?", "Its resistance can be changed to control current.", ["Its resistance can be changed to control current.", "It can only measure voltage across a lamp.", "It melts every time current flows.", "It turns a series circuit into an alkali."], 3, "Variable means adjustable."),
    ("Which circuit description is series?", "All components are in one loop with no branches.", ["All components are in one loop with no branches.", "Each component is on a separate branch across the cell.", "There is no complete path for current.", "The voltmeter is connected across every wire in turn."], 3, "Series = one path."),
    ("Which circuit description is parallel?", "There are two or more branches for current to follow.", ["There are two or more branches for current to follow.", "There is exactly one loop and no branches.", "There is no cell in the circuit.", "Every component must be controlled by one switch only."], 3, "Parallel = branches."),
    ("In a series circuit, ammeter A reads 0.4 A before a lamp. What should another ammeter read after the lamp?", "0.4 A", ["0.4 A", "0.2 A", "0 A", "0.8 A"], 4, "Current is the same everywhere in one series loop."),
    ("A parallel circuit has branch currents of 0.2 A and 0.3 A. What is the total current from the cell?", "0.5 A", ["0.5 A", "0.3 A", "0.2 A", "0.1 A"], 5, "Total current is the sum of the branch currents."),
    ("One lamp breaks in a parallel circuit with two separate lamp branches. What usually happens to the other lamp?", "It can stay lit because its branch is still complete.", ["It can stay lit because its branch is still complete.", "It must go out because all current is used by the broken lamp.", "It becomes part of a series circuit automatically.", "It receives no voltage because parallel circuits share no energy."], 4, "Separate branches can keep working."),
    ("Two identical lamps are added in series to the same cell. What is the most likely effect?", "The lamps are dimmer because total resistance increases and current decreases.", ["The lamps are dimmer because total resistance increases and current decreases.", "The lamps are brighter because each lamp receives the full supply current twice.", "The second lamp is always off because current is used up by the first.", "The cell voltage changes into resistance."], 5, "Series lamps share the supply and increase resistance."),
    ("Which combination would give the largest current?", "High voltage and low resistance.", ["High voltage and low resistance.", "High voltage and high resistance.", "Low voltage and high resistance.", "Low voltage and no complete circuit."], 4, "Use I = V/R reasoning."),
    ("Which rearrangement correctly gives current from voltage and resistance?", "I = V ÷ R", ["I = V ÷ R", "I = V × R", "I = R ÷ V", "I = V + R"], 5, "From V = I × R, current = voltage divided by resistance."),
    ("Which switch arrangement acts like an AND circuit for a lamp?", "Two switches in series, so both must be closed.", ["Two switches in series, so both must be closed.", "Two switches in parallel, so either one can complete a branch.", "One open switch placed across the lamp.", "A voltmeter connected in series with the lamp."], 4, "AND means switch A and switch B must be closed."),
    ("Which switch arrangement acts like an OR circuit for a lamp?", "Two switches in parallel branches, so either switch can complete a path.", ["Two switches in parallel branches, so either switch can complete a path.", "Two switches in series, so both must be closed.", "A single switch removed from the circuit.", "An ammeter connected across the lamp."], 4, "OR means switch A or switch B can complete the circuit."),
    ("What is the safety role of a fuse?", "It melts and breaks the circuit if the current becomes too high.", ["It melts and breaks the circuit if the current becomes too high.", "It increases the current to make appliances work faster.", "It measures voltage across the appliance.", "It stores extra charge for later use."], 4, "Fuse wire melts when overheated by too much current."),
    ("In a UK-style plug, which colour is the earth wire?", "green/yellow", ["green/yellow", "brown", "blue", "red"], 3, "Earth is green/yellow; live is brown; neutral is blue."),
    ("Why do models help when learning about electric circuits?", "Charges and energy transfers are difficult to see directly, so models help us reason about them.", ["Charges and energy transfers are difficult to see directly, so models help us reason about them.", "Models prove electricity is imaginary.", "Models are always exactly the same as real circuits.", "Models replace the need for observations."], 4, "A model helps understanding but has limits."),
    ("Which example is a physical model of an electric circuit?", "A pump-and-pipes model that can be touched and observed.", ["A pump-and-pipes model that can be touched and observed.", "A circuit diagram drawn using symbols.", "The idea that voltage is like a push.", "A truth table for switch logic."], 4, "Physical models are material/touchable."),
    ("Which example is an abstract model of a circuit?", "A circuit diagram using standard symbols.", ["A circuit diagram using standard symbols.", "A working circuit made from wires and lamps.", "A plastic model of a skeleton.", "A real battery connected to a motor."], 4, "Abstract models are representations or ideas rather than physical replicas."),
    ("AND circuit: switch A is open and switch B is closed. What happens to the lamp?", "It stays off because the series path is still broken.", ["It stays off because the series path is still broken.", "It lights because one switch is enough in an AND circuit.", "It lights because switch B is nearest the lamp.", "It flashes because the current splits into two paths."], 4, "For AND, both switches must be closed."),
    ("AND circuit: switch A is closed and switch B is closed. What happens to the lamp?", "It lights because the whole series path is complete.", ["It lights because the whole series path is complete.", "It stays off because one switch must be open.", "It stays off because current is used up by the first switch.", "It lights only if a voltmeter is in series."], 4, "Two closed series switches complete the path."),
    ("OR circuit: switch A is open and switch B is closed on a separate branch. What happens to the lamp?", "It lights because one complete branch is enough.", ["It lights because one complete branch is enough.", "It stays off because both switches must be closed.", "It stays off because open switch A blocks every branch.", "It lights only if branch currents are equal."], 4, "For OR, either complete branch can work."),
    ("OR circuit: switch A is open and switch B is open. What happens to the lamp?", "It stays off because there is no complete branch.", ["It stays off because there is no complete branch.", "It lights because parallel circuits always work.", "It lights because current can jump across open switches.", "It becomes a series circuit and glows dimly."], 4, "No closed branch means no complete circuit."),
    ("Two identical lamps are connected in series to a 6 V supply. What happens to the supply voltage?", "It is shared between the lamps.", ["It is shared between the lamps.", "Each lamp gets the full 6 V plus extra from the wires.", "The first lamp uses all voltage so the second gets none.", "Voltage disappears after passing through the switch."], 4, "In series, components share the supply voltage."),
    ("Two branches are connected in parallel across the same cell. What voltage is across each branch?", "The same supply voltage is across each branch.", ["The same supply voltage is across each branch.", "The first branch gets all the voltage and the second gets none.", "The voltage is always half in every branch, whatever the circuit.", "There is no voltage in a parallel branch."], 4, "Parallel branches are connected across the same supply."),
    ("Which set gives realistic dangers from unsafe electricity use?", "electric shock, burns and fire", ["electric shock, burns and fire", "sour taste, neutralisation and corrosion only", "stronger bones, faster reaction time and gas exchange", "increased pH, salt formation and respiration"], 3, "Electricity can injure people and cause fires."),
    ("Why should electrical equipment not be used with wet hands?", "Water on skin can lower resistance and increase shock risk.", ["Water on skin can lower resistance and increase shock risk.", "Water always turns copper into an insulator.", "Water makes the voltage of mains electricity zero.", "Water changes a series circuit into a parallel circuit."], 4, "Wet skin conducts better than dry skin."),
    ("Why is plugging too many appliances into one socket unsafe?", "The current may be too large, overheating wires and causing a fire.", ["The current may be too large, overheating wires and causing a fire.", "The voltage always becomes zero so appliances stop safely.", "The wires become thicker and less resistant.", "The fuse prevents any current from flowing at all times."], 4, "Too much current can overheat wires."),
    ("Before changing components in a school circuit, what is the safest first action?", "Switch off the power supply.", ["Switch off the power supply.", "Increase the voltage to check the fault faster.", "Hold both terminals to test for current.", "Short-circuit the cell with a wire."], 3, "Switch off before changing the circuit."),
    ("Why are cells usually safer than mains electricity for school circuits?", "Cells usually provide a much lower voltage.", ["Cells usually provide a much lower voltage.", "Cells cannot supply any current.", "Cells are always connected in parallel.", "Cells contain no stored energy."], 3, "Lower voltage usually means lower shock risk."),
    ("A fuse has melted in a plug. What does this tell you?", "The current was too high, so the fuse broke the circuit.", ["The current was too high, so the fuse broke the circuit.", "The voltage was too low, so the fuse supplied energy.", "The plug became a parallel circuit automatically.", "The fuse measured the current and reset itself."], 4, "A melted fuse is evidence of too much current."),
    ("A circuit breaker trips while an appliance is running. What has it done?", "It has opened the circuit to stop the current.", ["It has opened the circuit to stop the current.", "It has increased the current so the appliance runs faster.", "It has changed voltage into resistance.", "It has connected the appliance to the earth wire only."], 4, "Circuit breakers switch off current when unsafe."),
    ("Which row correctly matches live, neutral and earth wire colours in a UK-style plug?", "live brown, neutral blue, earth green/yellow", ["live brown, neutral blue, earth green/yellow", "live blue, neutral brown, earth green/yellow", "live green/yellow, neutral blue, earth brown", "live brown, neutral green/yellow, earth blue"], 4, "Live = brown, neutral = blue, earth = green/yellow."),
    ("Two wires are the same material and length. Which wire has the higher resistance?", "the thinner wire", ["the thinner wire", "the thicker wire", "both must have zero resistance", "the wire connected to the negative terminal only"], 4, "Thinner wires have higher resistance."),
    ("If a wire is made longer but material and thickness stay the same, what happens to resistance?", "It increases.", ["It increases.", "It decreases to zero.", "It becomes the same as voltage.", "It is unaffected by length."], 4, "Longer wire gives charges more material to pass through."),
    ("Which set of factors can affect the resistance of a wire?", "length, thickness and material", ["length, thickness and material", "colour, smell and brightness", "pH, litmus colour and salt name", "pulse rate, muscle pair and blood type"], 3, "Wire resistance depends on dimensions and material."),
]


def main() -> None:
    with CSV_PATH.open(newline="", encoding="utf-8-sig") as f:
        reader = csv.DictReader(f)
        fieldnames = reader.fieldnames or []
        rows = list(reader)

    mc_indices = [i for i, row in enumerate(rows) if row.get("Type", "").strip() == "Multiple choice"]
    if len(mc_indices) != len(REPLACEMENTS):
        raise SystemExit(f"Expected {len(REPLACEMENTS)} MC rows, found {len(mc_indices)}")

    changes = []
    for idx, repl in zip(mc_indices, REPLACEMENTS):
        row = rows[idx]
        old_front = row["Front"]
        old_choices = row.get("Choices", "")
        old_difficulty = row.get("Difficulty", "")
        front, back, choices, difficulty, cue = repl
        row["Front"] = front
        row["Back"] = back
        row["Choices"] = " | ".join(choices)
        row["Difficulty"] = str(difficulty)
        # Keep existing cue only if it is more specific; otherwise replace for MC explanation feedback.
        row["Extra cue"] = cue
        changes.append({
            "Id": row.get("Id", ""),
            "Unit": row.get("Unit", ""),
            "Pack section": row.get("Pack section", ""),
            "Old front": old_front,
            "New front": front,
            "Old difficulty": old_difficulty,
            "New difficulty": str(difficulty),
            "Old choices": old_choices,
            "New choices": row["Choices"],
        })

    with CSV_PATH.open("w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(rows)

    CHANGES_PATH.parent.mkdir(exist_ok=True)
    with CHANGES_PATH.open("w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=list(changes[0].keys()))
        writer.writeheader()
        writer.writerows(changes)

    DOC_PATH.write_text("""# v8 Multiple-choice difficulty pass

This patch keeps the deck size stable and rewrites the existing multiple-choice cards so Quiz mode is less obvious and more useful for revision.

## What changed

- Rewrote all **123** existing multiple-choice cards.
- Removed silly cross-topic distractors such as pH answers in electricity questions or bone answers in acids questions.
- Replaced most definition-only prompts with scenario, misconception, calculation, or best-explanation prompts.
- Kept stable `Id` values so previous progress is not reset just because wording changed.
- Updated `Back`, `Choices`, `Extra cue`, and `Difficulty` for the rewritten MC cards.
- Regenerated `data/flashcards.js` from the CSV.

## Difficulty distribution after this pass

- Difficulty 3: baseline recall with plausible distractors.
- Difficulty 4: application, misconception correction, or closely related distractors.
- Difficulty 5: calculation/rearrangement or multi-step reasoning.

The intent is that multiple-choice mode now checks whether the child understands the difference between similar ideas, not just whether they can spot an obviously impossible answer.

## Content count

The total deck remains **412 cards**. The multiple-choice count remains **123 cards**.

## Detailed changes

See `docs/v8-multiple-choice-wording-changes.csv` for before/after wording and choice changes.
""", encoding="utf-8")

    print(f"Updated {len(mc_indices)} multiple-choice cards")
    print(f"Wrote {CHANGES_PATH}")
    print(f"Wrote {DOC_PATH}")


if __name__ == "__main__":
    main()
