class PokemonCharacter {

    constructor(name, pic, types, weight, height, stats) {
        this.name = name;
        this.pic = pic; 
        this.types = types; 
        this.weight = weight; 
        this.height = height; 
        this.stats = stats; 

    }

    static async fetchPokeData(url) {

        try {

            let response = await fetch(url);
            let data = await response.json();
            return data; 

        } catch (error) {

            console.log("Error fetching pokemon:", error); 
            throw error; 
        }
    }
}

class CreateCharacter {

    static createCharacterDiv(character) {

        const { name, sprites, types, weight, height, stats } = character;
        const characterDiv = document.createElement("div"); 
        const wrapper = document.getElementById("fighter-wrapper"); 
        let typesList = ""; 
        let pic = "";
        let statsList = ""; 
        const defaultPic = sprites.front_default;
        
        
        // ITERERA GENOM ARRAY
        types.forEach(type => {
            typesList += `<h3><u>Type:</u> ${type.type.name}</h3>`;
        });

        // ITERERA GENOM BILDERNA I OBJEKTET
        for (const key in sprites) {
            if (sprites.hasOwnProperty(key)) {
                if (key === 'front_default' && defaultPic) {
                    pic += `<img src="${sprites[key]}">`;
                }
            }
        }

        stats.forEach(stat => {
            statsList += `<h3><u>${stat.stat.name}:</u> ${stat.base_stat}</h3>`;
        });


        characterDiv.innerHTML = `
            <div id="character-info-card">
                ${pic}
                <h3><u>Name:</u> ${name}</h3>
                ${typesList}
                <h3><u>Weight:</u> ${weight}</h3>
                <h3><u>Height:</u> ${height}</h3>
                ${statsList}
            </div>
        `;

        wrapper.append(characterDiv); 

        return characterDiv; 
        
    }

    static createButton() {

        let compareBtn = document.createElement("button");
        const wrapper = document.getElementById("fighter-wrapper"); 
        compareBtn.setAttribute("id", "compare-pokemon-button"); 

        compareBtn.innerHTML = `Compare Pokemons<br>
        <i class="fa fa-arrows-h" style="font-size:36px"></i>`; 
        wrapper.append(compareBtn); 

        let fightBtn = document.createElement("button"); 
        const fightwrapper = document.getElementById("fight"); 
        fightBtn.setAttribute("id", "fight-pokemon-button");

        fightBtn.innerHTML = `
        <i class="fa fa-flash" style="font-size:36px"></i>
        Fight Pokemon
        <i class="fa fa-flash" style="font-size:36px"></i>
        `
        fightwrapper.append(fightBtn); 
        
    }

    static compareStats(property, results, color) {

        const wrapper = document.getElementById("compare-wrapper");
        const compareDiv = document.createElement("div"); 

        // STYLING FOR WINNER/LOSER/TIE
        compareDiv.innerHTML = `
        <h3 class="${color}">${property}: ${results}</h3>
        `
        wrapper.append(compareDiv);

        showDiv(); 
    
        return compareDiv; 
    }

    static createFight(color, results) {

        const wrapper = document.getElementById("fight"); 
        const fightDiv = document.createElement("div");

        fightDiv.innerHTML = `
        <h3 class="${color}">${results}!
        `

        wrapper.append(fightDiv); 

        return fightDiv; 
    }

    static createDefense(color, results) {

        const wrapper = document.getElementById("fight"); 
        const fightDiv = document.createElement("div");

        fightDiv.innerHTML = `
        <h3 class="${color}">${results}!
        `
        wrapper.append(fightDiv); 

        return fightDiv; 

    }

}


class Interaction {

    constructor(poke1, poke2) {
        this.poke1 = poke1; 
        this.poke2 = poke2; 
    }

    async getStats() {

        const poke1Stats = {
            name: this.poke1.name,
            height: this.poke1.height,
            weight: this.poke1.weight,
            moves: this.poke1.moves,
        };
        const poke2Stats = {
            name: this.poke2.name,
            height: this.poke2.height,
            weight: this.poke2.weight,
            moves: this.poke2.moves, 
        };

        this.poke1.stats.forEach(stat => {
            poke1Stats[stat.stat.name] = stat.base_stat;
        });
    
        this.poke2.stats.forEach(stat => {
            poke2Stats[stat.stat.name] = stat.base_stat;
        });
    
        return [poke1Stats, poke2Stats];
    }


     async compareCharacters() {

        const [poke1Stats, poke2Stats] = await this.getStats();
    
        // COMPARE POKEMONS
        const fields = ["weight", "height", "hp", "attack", "defense", "special-attack", "special-defense", "speed"];
        
        fields.forEach(field => {

            if (poke1Stats[field] > poke2Stats[field]) {

                CreateCharacter.compareStats(field, `${this.poke1.name} has higher ${field}`, "poke1");

            } else if (poke1Stats[field] < poke2Stats[field]) {

                CreateCharacter.compareStats(field, `${this.poke2.name} has higher ${field}`, "poke2");
            } else {

                CreateCharacter.compareStats(field, `Both ${this.poke1.name} & ${this.poke2.name} have the same ${field}`, "tie");
            }
        });
    }

    async startFight(poke1, poke2) {
        const [poke1Stats, poke2Stats] = await this.getStats();

        console.log("poke1Stats:", poke1Stats); 
        console.log("poke2Stats:", poke2Stats); 

        const poke1FirstMove = await poke1Stats.moves[0].move.name;
        const poke2FirstMove = await poke2Stats.moves[0].move.name;

        console.log("Poke 1 moves:", poke1Stats.moves[0].move.name); // FUNKAR
        console.log("Poke 2 moves:", poke2Stats.moves[0].move.name); // FUNKAR

        if (poke1Stats.speed > poke2Stats.speed) {
            this.fight(poke1, poke2, poke1FirstMove);
        } else {
            this.fight(poke2, poke1, poke2FirstMove);
        }
    }
    
    async fight(attacker, defender, moves) {

        const [attackerStats, defenderStats] = await this.getStats(); 
        const damage = Interaction.calculateDamage(attackerStats.attack, attackerStats["special-attack"], defenderStats.defense, defenderStats["special-defense"]);
        
        const hpAttacker = await Interaction.remainingHp(attackerStats.hp, 0); // 0 då attacker ej blev skadad
        const hpDefender = await Interaction.remainingHp(defenderStats.hp, damage);

        const message = `${attacker.name} hit ${defender.name} with ${moves} for ${damage} damage!`;
        const defenseMessage = `${defender.name} remaining HP: ${hpDefender}`;
        const attackMessage = `${attacker.name} remaining HP: ${hpAttacker}`;  

        CreateCharacter.createFight("attacker-color", message); // SKAPAR UPP FÄRG FÖR ATTACK
        CreateCharacter.createDefense("defense-color", defenseMessage);
        CreateCharacter.createFight("attacker-color", attackMessage);


    }

    async runFight(attacker, defender) {

        const [attackerStats, defenderStats] = await this.getStats(); 
        let attackerHp = attackerStats.hp; 
        let defenderHp = defenderStats.hp; 
        let isAttackersTurn = attackerStats.speed > defenderStats.speed; 

        const attackerCurrentMove = await attackerStats.moves[0].move.name; //ÄNDRA VARIABELNAMN .............
        const defenderCurrentMove = await defenderStats.moves[0].move.name;

        for (let i=0; i<1000; i++) {

            if(isAttackersTurn) {

                const currentDamage = Interaction.calculateDamage(
                    attackerStats.attack, 
                    attackerStats["special-attack"], 
                    defenderStats.defense, 
                    defenderStats["special-defense"]);

                defenderHp -= currentDamage; 

                const message = `${attacker.name} hit ${defender.name} with ${attackerCurrentMove} for ${currentDamage} damage!`;
                CreateCharacter.createFight("attacker-color", message);
                if(defenderHp <= 0) {

                    const message = `${defender.name} died`;
                    CreateCharacter.createFight("defender-color", message);
                    break; 
                }

            } else {
            // DEFENDER ATTACKERAR ATTACKER
                const currentDamage = Interaction.calculateDamage(
                    defenderStats.attack, 
                    defenderStats["special-attack"], 
                    attackerStats.defense, 
                    attackerStats["special-defense"]);

                attackerHp -= currentDamage;

                const message = `${defender.name} hit ${attacker.name} with ${defenderCurrentMove} for ${currentDamage} damage!`;
                CreateCharacter.createFight("defender-color", message);

                if(attackerHp <= 0) {

                    const message = `${attacker.name} died`;
                    CreateCharacter.createFight("attacker-color", message);
                    break; 
                }

            } 
                
            isAttackersTurn = !isAttackersTurn; // TOGGLAR MELLAN LÄGEN ATTACKERSTURN
            await Interaction.sleep(1000); 
            
        }

    }

    static sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    static calculateDamage(attack, specialAttack, defense, specialDefense) {

        const attackInt = parseInt(attack);
        const specialAttInt = parseInt(specialAttack);
        const defenseInt = parseInt(defense);
        const specialDefInt = parseInt(specialDefense);

        const totalAttack = attackInt + specialAttInt;
        const totalDefense = defenseInt + specialDefInt; 

        const damage = totalAttack - (totalDefense * 0.8);

        if(damage < 10) { // CALCULATE DAMAGE FOR NEGATIVE NUMBERS 
            return 10; 
        }
        
        return damage; 

    }

    static async remainingHp(currentHp, damage) {
        
        const remainingHp = currentHp - damage;

        if (remainingHp <= 0) {
            return `Was killed <i class="fa fa-frown-o" style="font-size:36px"></i>`;
        }

        return remainingHp; 
    }
}

// EVENTLISTENERS & SHOW INFO DIV'S ----------------------------------------------------------- // 
function showFight() {
    document.getElementById("fight").style.display = "flex";
}

function showDiv() {
    document.getElementById("compare-wrapper").style.display = "block"; 
}

let selectFighterBtn = document.getElementById("select-fighter"); 

selectFighterBtn.addEventListener("click", async () => {

    let valueOne = document.getElementById("fighter-one").value;
    let valueTwo = document.getElementById("fighter-two").value;

    const url1 = "https://pokeapi.co/api/v2/pokemon/" + valueOne; 
    const url2 = "https://pokeapi.co/api/v2/pokemon/" + valueTwo;

    try {
        const [pokemon1, pokemon2] = await Promise.all([

            PokemonCharacter.fetchPokeData(url1),
            PokemonCharacter.fetchPokeData(url2)
        ]);

        CreateCharacter.createCharacterDiv(pokemon1);
        CreateCharacter.createButton(); 
        CreateCharacter.createCharacterDiv(pokemon2);

    } catch (error) {
        console.error('Error:', error);
    }

    
    showFight(); 

    let compareBtn = document.getElementById("compare-pokemon-button"); 

    // BUTTON FOR COMPARING POKEMONS -----------------------------------
    compareBtn.addEventListener("click", async () => {

        console.log("klickat!");
    
        try {
            const [pokemon1, pokemon2] = await Promise.all([
                PokemonCharacter.fetchPokeData(url1),
                PokemonCharacter.fetchPokeData(url2)
            ]);
    
            const interaction = new Interaction(pokemon1, pokemon2);
            await interaction.compareCharacters();

        } catch (error) {
            console.error('Error:', error);
        }
    });

    let fightBtn = document.getElementById("fight-pokemon-button"); 

    fightBtn.addEventListener("click", async () => {

        console.log("klickat på fightbtn!"); 

        try {

            const [pokemon1, pokemon2] = await Promise.all([
                PokemonCharacter.fetchPokeData(url1),
                PokemonCharacter.fetchPokeData(url2)
            ]);

            const newInteraction = new Interaction(pokemon1, pokemon2);
            await newInteraction.runFight(pokemon1, pokemon2); 

        } catch (error) {
            console.log("Error:", error); 
        }


    })


});
