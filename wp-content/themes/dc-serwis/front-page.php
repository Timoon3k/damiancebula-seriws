<?php get_header(); ?>
<?php while (have_posts()) : the_post(); get_template_part('template-parts/reference-home'); dc_reference_home_content(get_the_content()); endwhile; ?>
<?php get_footer(); ?>
