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
        
        
        // Iterera igenom arrayen
        types.forEach(type => {
            typesList += `<h3><u>Type:</u> ${type.type.name}</h3>`;
        });

        // Iterera igenom bilderna i objektet
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

    static compareStats(property, results, winner, color) {

        const wrapper = document.getElementById("compare-wrapper");
        const compareDiv = document.createElement("div"); 

        console.log("winner name:", winner); 

        // STYLING FOR WINNER/LOSER/TIE
        compareDiv.innerHTML = `
        <h3 class="${color}">${property}: ${results}<br></h3>
        `
        wrapper.append(compareDiv);

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
        const properties = ["weight", "height", "hp", "attack", "defense", "special-attack", "special-defense", "speed"];

        let winner = null;
        
        properties.forEach(property => {

            if (poke1Stats[property] > poke2Stats[property]) {
                winner = this.poke1; 
                CreateCharacter.compareStats(property, `${this.poke1.name} has higher ${property}`, winner.name, "poke1");

            } else if (poke1Stats[property] < poke2Stats[property]) {
                winner = this.poke2; 
                CreateCharacter.compareStats(property, `${this.poke2.name} has higher ${property}`, winner.name, "poke2");
            } else {
                CreateCharacter.compareStats(property, `Both ${this.poke1.name} & ${this.poke2.name} have the same ${property}`, winner.name, "tie");
            }
        });

        return winner; 
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
        const damage = (attackerStats.attack, defenderStats.defense, attackerStats, defenderStats);
        
        const message = `${attacker.name} hit ${defender.name} with ${moves} for ${damage} damage!` // DAMAGE FUNKAR INTE [OBJECT OBJECT]

        CreateCharacter.createFight("fight1", message); 


    }

    static async calculateDamage(attack, defense, hpAttacker, hpDefender) {

        const [attackerStats, defenderStats] = await this.getStats(); 

        const damage = ((attack+special-attack)-(defense+special-defense)) * 0.8; 

        if(damage > hpAttacker || damage > hpDefender) {
            return `Was killed`; 
        }

        return damage; 

    }

}


// EVENTLISTENERS ------------------------------------------------------------- // 

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
            CreateCharacter.compareStats(pokemon1);
            CreateCharacter.compareStats(pokemon2); 

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

            const interaction = new Interaction(pokemon1, pokemon2); 
            await interaction.startFight(pokemon1, pokemon2); 

        } catch (error) {
            console.log("Error:", error); 
        }


    })


});
