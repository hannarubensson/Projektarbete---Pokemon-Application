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
        
    }



}
class Interaction {

    constructor(poke1, poke2) {
        this.poke1 = poke1; 
        this.poke2 = poke2; 
    }

    getStats(poke1, poke2) {

        const stats = {};
    
        poke1.stats.forEach(stat => {
            stats[stat.stat.name] = stat.base_stat;
        });

        poke2.stats.forEach(stat => {
            stats[stat.stat.name] = stat.base_stat;
        });
    
            return stats;
        
    }

    compareCharacters(poke1, poke2) {

        poke1 = this.poke1;
        poke2 = this.poke2;

        const poke1Stats = this.getStats(poke1);
        const poke2Stats = this.getStats(poke2);

        console.log(`${poke1.name} stats:`, poke1Stats);
        console.log(`${poke2.name} stats:`, poke2Stats);

        // Hitpoints, attack, special attack, defense, special defense, speed

    }

    fight(poke1, poke2) {


    }
    
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

        console.log(pokemon1);
        console.log(pokemon2);

    } catch (error) {
        console.error('Error:', error);
    }


    let compareBtn = document.getElementById("compare-pokemon-button"); 

    // BUTTON FOR COMPARING POKEMONS
    compareBtn.addEventListener("click", () => {

        console.log("klickat!");
    
        let poke1 = document.getElementById("fighter-one").value;
        let poke2 = document.getElementById("fighter-two").value;

        const interaction = new Interaction(poke1, poke2);
        interaction.compareCharacters(poke1, poke2); 


});


});
