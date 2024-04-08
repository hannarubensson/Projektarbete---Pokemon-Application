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
        
        
        
        types.forEach(type => {
            typesList += `<h3>Type: ${type.type.name}</h3>`;
        });

        // Forloop för att gå igenom bilderna (så inte alla bilder visas ut)
        for (const key in sprites) {
            if (sprites.hasOwnProperty(key)) {
                if (key === 'front_default' && defaultPic) {
                    pic += `<img src="${sprites[key]}">`;
                }
            }
        }

        stats.forEach(stat => {
            statsList += `<h3>${stat.stat.name}: ${stat.base_stat}</h3>`;
        });


        characterDiv.innerHTML = `
            <div id="character-info-card">
                ${pic}
                <h3>Name: ${name}</h3>
                ${typesList}
                <h3>Weight: ${weight}</h3>
                <h3>Height: ${height}</h3>
                ${statsList}
            </div>
        `;

        wrapper.append(characterDiv); 

        return characterDiv; 
        
    }



}

class CompareCharacters {


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
        CreateCharacter.createCharacterDiv(pokemon2);

        console.log(pokemon1);
        console.log(pokemon2);

    } catch (error) {
        console.error('Error:', error);
    }
    
});

