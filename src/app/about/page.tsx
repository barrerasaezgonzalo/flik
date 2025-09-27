import Link from "next/link";
import Image from "next/image";

export const metadata = {
  title: "Sobre Flik | Blog de tecnología en español",
  description:
    "Conoce la historia de Flik, un blog de tecnología en español con artículos sobre programación, inteligencia artificial, seguridad y más.",
};

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto prose prose-lg">
      <h1 className="text-4xl font-bold text-gray-900 mb-8 border-b pb-4">
        Sobre Flik
      </h1>

      <p className="mb-4">
        Hola, soy <strong>Gonzalo</strong>. Soy desarrollador de software y
        decidí crear <strong>Flik</strong> como un{" "}
        <strong>blog de tecnología</strong> en español, pensado para compartir
        experiencias reales sobre desarrollo, programación, inteligencia
        artificial, seguridad informática y todo lo que aparece en el camino.
      </p>

      <p className="mb-4">
        Flik no es un medio formal ni una revista, es simplemente un lugar donde
        volcar lo que vamos aprendiendo (y lo que sale mal en el proceso). Aquí
        encontrarás contenido técnico, opiniones, experimentos y reflexiones
        sobre el día a día en el mundo de la tecnología.
      </p>

      <p className="mb-4">
        Este blog nació para recopilar las experiencias reales de quienes viven
        el día a día de la informática. No buscamos teorías impecables ni
        tutoriales llenos de fórmulas perfectas, sino mostrar lo que pasa cuando
        alguien se sienta frente a una pantalla y se enfrenta al caos: errores,
        bugs, bloqueos mentales y esas pequeñas victorias que hacen que todo
        valga la pena.
      </p>

      <p className="mb-4">
        Creemos firmemente que el aprendizaje más profundo no viene solo de
        estudiar, sino de atreverse a fallar. Cada error deja una marca, y esa
        marca enseña más que cualquier clase. Aquí celebramos la práctica
        constante, el ensayo y error, y el hecho de que equivocarse no es perder
        el tiempo, sino parte esencial del camino para dominar la tecnología.
      </p>

      <p className="mb-4">
        Todo el contenido publicado en este blog de tecnología es original y
        creado exclusivamente para Flik, reflejando la visión personal de
        quienes lo escriben.
      </p>

      <p className="mb-4">
        Si en algún momento tienes críticas, detectas algún problema con el
        contenido, necesitas que eliminemos una publicación, o simplemente
        quieres darnos ideas para mejorar, puedes escribirnos a{" "}
        <a href="mailto:hola@flik.cl">hola@flik.cl</a>.
      </p>

      <div className="bg-gray-100 p-4 my-8 text-center border border-dashed  rounded-lg">
        <Link
          href="https://www.linkedin.com/sharing/share-offsite/?url=https://flik.cl"
          target="_blank"
        >
          <Image
            src="/ads/ayudanos.png"
            alt="Ayúdamos a crecer. comparte este Blog con tus amigos y Colegas"
            width={900}
            height={185}
            quality={75}
            sizes="100vw"
            className="w-full h-auto object-cover transition-transform duration-300 hover:scale-105 rounded"
          />
        </Link>
      </div>
    </div>
  );
}
