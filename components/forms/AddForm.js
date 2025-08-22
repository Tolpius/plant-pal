export default function AddForm() {
  return (
    <form>
      <h2>add a new plant</h2>

      <label>
        Name:
        <input name="name" type="text" />
      </label>

      <label>
        Botanical Name:
        <input name="botanicalName" type="text" />
      </label>

      <label>
        Image URL:
        <input name="imageURL" type="url" />
      </label>

      <fieldset>
        <legend>Water Need</legend>
        <input name="waterNeed" type="range" min="1" max="3" step="1" />
        <div>
          <span>Low</span>
          <span>Medium</span>
          <span>High</span>
        </div>
      </fieldset>

      <fieldset>
        <legend>Light Need</legend>
        <input name="lightNeed" type="range" min="1" max="3" step="1" />
        <div>
          <span>Low</span>
          <span>Medium</span>
          <span>High</span>
        </div>
      </fieldset>

      <fieldset>
        <legend>Fertiliser Season</legend>
        <label>
          <input type="radio" name="fertiliserSeason" value="spring" />
          Spring
        </label>
        <label>
          <input type="radio" name="fertiliserSeason" value="summer" />
          Summer
        </label>
        <label>
          <input type="radio" name="fertiliserSeason" value="autumn" />
          Autumn
        </label>
        <label>
          <input type="radio" name="fertiliserSeason" value="winter" />
          Winter
        </label>
      </fieldset>

      <label>
        Description:
        <textarea name="description" rows="4" />
      </label>

      <button type="submit">Save Plant</button>
    </form>
  );
}
