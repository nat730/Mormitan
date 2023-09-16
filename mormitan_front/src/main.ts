  // Fonction pour vérifier si une chaîne est une URL valide
  function isValidUrl(url: string): boolean {
    const pattern = new RegExp(
      "^(https?:\\/\\/)?" +
        "((([a-zA-Z\\d]([a-zA-Z\\d-]*[a-zA-Z\\d])*)\\.)+[a-zA-Z]{2,}|" +
        "((\\d{1,3}\\.){3}\\d{1,3}))" +
        "(\\:\\d+)?(\\/[-a-zA-Z\\d%@_.~+&:]*)*" +
        "(\\?[;&a-zA-Z\\d%@_.,~+&:=-]*)?" +
        "(\\#[-a-zA-Z\\d_]*)?$",
      "i"
    )
    return !!pattern.test(url)
  }


  interface IDataInDB {
    id?: number
    name: string
    link: string
    time: number
    note: number
  }

  const nameInput = document.getElementById("name") as HTMLInputElement
  const imageInput = document.getElementById("image") as HTMLInputElement
  const durationInput = document.getElementById("duration") as HTMLInputElement
  const noteSelect = document.getElementById("note") as HTMLSelectElement

  const addButton = document.getElementById("addButton") as HTMLButtonElement

  addButton.addEventListener("click", async () => {
    const selectedNote = noteSelect.value

    if (selectedNote === "quel note lui attribuez vous ?") {
      alert("Veuillez sélectionner une note pour la recette.")
      return
    }

    const name = nameInput.value
    const image = imageInput.value
    const duration = parseFloat(durationInput.value)
    const note = parseInt(selectedNote)

    if (isNaN(duration) || duration <= 0) {
      alert("La durée doit être un nombre valide et supérieure à zéro.")
      return
    }

    const imageUrl = image

    // Vérification de l'URL
    if (!isValidUrl(imageUrl)) {
      alert("L'URL de l'image n'est pas valide.")
      return
    }

    const newData: IDataInDB = {
      name,
      link: imageUrl,
      time: duration,
      note,
    };

    try {
      const response = await fetch("http://localhost:3000/recipes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newData),
      });
      const recipe = await response.json();
    
      // Assurez-vous d'ajouter l'ID à l'objet newData avant d'appeler createRecipe
      newData.id = recipe.id;
    
      console.log("Données ajoutées avec succès à la base de données.");
      createRecipe(newData);
    } catch (error) {
      console.error("Erreur lors de la requête HTTP POST :", error);
    }

    nameInput.value = ""
    imageInput.value = ""
    durationInput.value = ""
    noteSelect.value = "quel note lui attribuez vous ?"
  })

  function createRecipe(data: IDataInDB) {
    const recipesList = document.getElementById("recipes_List") as HTMLElement;

    const recipeElement = document.createElement("div");
    recipeElement.className = "recipe";

    recipeElement.innerHTML = `
      <div class="recipe_title">
        <div class="title">${data.name}</div>
        <div class="info">note : ${data.note}/5</div>
        <div class="info">durée : ${data.time} minutes</div>
      </div>
      <div class="recipe_image">
        <img src="${data.link}" alt="${data.name}" />
      </div>
      <button class="delete-button">Supprimer</button>
    `;

    const deleteButton = recipeElement.querySelector(".delete-button");

    if (deleteButton) {
      deleteButton.addEventListener("click", async () => {
        try {
          await fetch("http://localhost:3000/recipes/" + data.id, {
            method: "DELETE",
          });
          recipeElement.remove();
        } catch (error) {
          console.error("Erreur lors de la suppression :", error);
        }
      });
    }

    if (recipesList) {
      recipesList.appendChild(recipeElement);
    }
  }

  async function Initialisation() {
    try {
      const response = await fetch("http://localhost:3000/recipes")
      const data = await response.json()
      console.log(data)
      data.forEach((element: IDataInDB) => {
        createRecipe(element);

      })
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des données depuis l'API :",
        error
      )
    }
  }

  Initialisation()
